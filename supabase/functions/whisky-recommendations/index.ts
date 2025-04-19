
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

    const accessToken = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'HuggingFace API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Generate user profile from bottles
    const userProfile = generateUserProfile(userBottles);
    
    // Prepare prompt for AI recommendations
    const prompt = `Based on this whisky collection profile: ${JSON.stringify(userProfile)}, 
                   recommend 5 whisky bottles that match this taste profile. 
                   Include the name, distillery, and flavor characteristics.`;

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
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get recommendations from HuggingFace API',
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }
    
    const aiResult = await response.json();
    
    // Process the AI response
    const recommendations = processAiRecommendations(aiResult);
    
    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
    Object.entries(bottle.flavor_profile || {}).forEach(([flavor, value]) => {
      if (value !== undefined) {
        if (!flavors[flavor]) flavors[flavor] = [];
        flavors[flavor].push(value);
      }
    });
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
    return [];
  }
  
  const text = aiResult[0].generated_text;
  const recommendations = [];
  
  // Simple parsing of recommendations from AI text
  const bottleMatches = text.match(/[\w\s]+(?:by|from)\s+[\w\s]+/gi) || [];
  
  bottleMatches.slice(0, 5).forEach(match => {
    const [name, distillery] = match.split(/by|from/i).map(s => s.trim());
    
    recommendations.push({
      name,
      distillery,
      flavor_profile: {
        // Placeholder flavor profile, in a real scenario this would be more sophisticated
        sweet: Math.floor(Math.random() * 10),
        smoky: Math.floor(Math.random() * 10),
        fruity: Math.floor(Math.random() * 10)
      },
      reason: `AI recommended based on your collection profile.`
    });
  });
  
  return recommendations;
}
