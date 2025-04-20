
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userBottles } = await req.json();
    
    if (!userBottles || !Array.isArray(userBottles)) {
      return new Response(
        JSON.stringify({ error: 'Valid user bottles data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check if the user bottles array is empty
    if (userBottles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Your whisky collection is empty' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const accessToken = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'HuggingFace API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Generate user profile from bottles
    const userProfile = generateUserProfile(userBottles);
    
    console.log("User profile generated:", JSON.stringify(userProfile));
    
    // Check if profile has enough data to make recommendations
    const hasRegions = userProfile.regions && userProfile.regions.length > 0;
    const hasFlavors = userProfile.topFlavors && userProfile.topFlavors.length > 0;
    
    if (!hasRegions && !hasFlavors) {
      console.log("Not enough profile data to generate recommendations");
    }
    
    // Prepare prompt for AI recommendations
    const prompt = `Based on this whisky collection profile: ${JSON.stringify(userProfile)}, 
                   recommend 5 whisky bottles that match this taste profile. 
                   Include the name, distillery, and flavor characteristics.`;

    console.log("Sending prompt to HuggingFace:", prompt);
    
    // Call HuggingFace API for recommendations
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        inputs: prompt, 
        parameters: { max_length: 500 } 
      }),
    });

    if (!response.ok) {
      let errorText = 'Failed to get recommendations from HuggingFace API';
      try {
        const errorData = await response.json();
        errorText = errorData.error || errorText;
        console.error("HuggingFace API error:", errorText);
      } catch (e) {
        errorText = await response.text();
        console.error("HuggingFace API error (raw):", errorText);
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }
    
    const aiResult = await response.json();
    console.log("HuggingFace API response:", JSON.stringify(aiResult));
    
    // Process the AI response
    const recommendations = processAiRecommendations(aiResult);
    
    // If no recommendations were generated, create fallback recommendations
    if (recommendations.length === 0) {
      console.log("No recommendations parsed from AI response, generating fallbacks");
      
      const fallbackRecommendations = generateFallbackRecommendations(userProfile);
      
      return new Response(
        JSON.stringify({ 
          recommendations: fallbackRecommendations,
          ai_response_raw: aiResult,
          note: "Used fallback recommendations due to AI processing issue"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to generate user profile
function generateUserProfile(bottles) {
  // Analyze regions, flavor profiles, and other characteristics
  const regions = {};
  bottles.forEach(bottle => {
    if (bottle.region) {
      regions[bottle.region] = (regions[bottle.region] || 0) + 1;
    }
  });
  
  const flavors = {};
  bottles.forEach(bottle => {
    if (bottle.flavor_profile) {
      Object.entries(bottle.flavor_profile || {}).forEach(([flavor, value]) => {
        if (value !== undefined) {
          if (!flavors[flavor]) flavors[flavor] = [];
          flavors[flavor].push(value);
        }
      });
    }
  });
  
  return {
    regions: Object.entries(regions)
      .sort((a, b) => b[1] - a[1])
      .map(([region]) => region),
    topFlavors: Object.entries(flavors)
      .map(([flavor, values]) => ({
        flavor,
        avgIntensity: values.reduce((a, b) => a + b, 0) / values.length
      }))
      .sort((a, b) => b.avgIntensity - a.avgIntensity)
      .slice(0, 3)
  };
}

// Helper function to parse AI recommendations
function processAiRecommendations(aiResult) {
  if (!aiResult || !aiResult[0] || !aiResult[0].generated_text) {
    console.error("No valid AI result to process");
    return [];
  }
  
  const text = aiResult[0].generated_text;
  console.log("Processing AI text:", text);
  
  const recommendations = [];
  
  // Improved parsing of recommendations from AI text
  // Try to match patterns like "Bottle Name by Distillery" or "Bottle Name from Distillery"
  const bottleMatches = text.match(/[\w\s'",-]+(?:by|from)\s+[\w\s'",-]+/gi) || [];
  
  if (bottleMatches.length === 0) {
    console.log("No bottle matches found in AI text, trying alternative parsing");
    // Alternative parsing logic - look for numbered lists
    const numberedItems = text.match(/\d+\.\s+([^\n]+)/g);
    if (numberedItems && numberedItems.length > 0) {
      numberedItems.forEach(item => {
        // Extract just the whisky name - assume first part is the name
        const cleanItem = item.replace(/^\d+\.\s+/, '').trim();
        const parts = cleanItem.split(/[-–—:]/);
        if (parts.length > 0) {
          const name = parts[0].trim();
          const distillery = parts.length > 1 ? parts[1].trim() : "Unknown Distillery";
          
          recommendations.push(createRecommendation(name, distillery));
        }
      });
    }
    return recommendations;
  }
  
  bottleMatches.slice(0, 5).forEach(match => {
    const parts = match.split(/by|from/i);
    if (parts.length < 2) return;
    
    const name = parts[0].trim();
    const distillery = parts[1].trim();
    
    recommendations.push(createRecommendation(name, distillery));
  });
  
  return recommendations;
}

// Helper to create a recommendation with random flavor profile
function createRecommendation(name, distillery) {
  // Generate random flavor profile based on common whisky characteristics
  const getRandomFlavor = () => Math.floor(Math.random() * 10);
  
  return {
    name,
    distillery,
    flavor_profile: {
      sweet: getRandomFlavor(),
      smoky: getRandomFlavor(),
      fruity: getRandomFlavor(),
      spicy: getRandomFlavor(),
      floral: getRandomFlavor()
    },
    reason: `Based on your collection's flavor profile, this ${distillery} whisky should complement your preferences.`
  };
}

// Generate fallback recommendations if AI fails
function generateFallbackRecommendations(userProfile) {
  const fallbackWhiskies = [
    { name: "Lagavulin 16", distillery: "Lagavulin", region: "Islay", flavors: { smoky: 9, peaty: 8, rich: 7 } },
    { name: "Macallan 12", distillery: "Macallan", region: "Speyside", flavors: { sweet: 8, fruity: 7, rich: 8 } },
    { name: "Redbreast 12", distillery: "Redbreast", region: "Ireland", flavors: { spicy: 7, fruity: 6, sweet: 7 } },
    { name: "Highland Park 18", distillery: "Highland Park", region: "Islands", flavors: { sweet: 7, smoky: 5, floral: 6 } },
    { name: "Buffalo Trace", distillery: "Buffalo Trace", region: "Kentucky", flavors: { sweet: 8, vanilla: 7, oak: 6 } }
  ];
  
  return fallbackWhiskies.map(whisky => ({
    name: whisky.name,
    distillery: whisky.distillery,
    flavor_profile: {
      sweet: whisky.flavors.sweet || Math.floor(Math.random() * 10),
      smoky: whisky.flavors.smoky || Math.floor(Math.random() * 10),
      fruity: whisky.flavors.fruity || Math.floor(Math.random() * 10),
      spicy: whisky.flavors.spicy || Math.floor(Math.random() * 10),
      floral: whisky.flavors.floral || Math.floor(Math.random() * 10)
    },
    reason: `Recommended as a quality ${whisky.region || "whisky"} that would complement your collection.`
  }));
}
