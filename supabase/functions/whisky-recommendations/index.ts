
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large";

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

    // Extract relevant information from user bottles
    const userProfile = generateUserProfile(userBottles);
    
    // Generate prompt for HuggingFace
    const prompt = `Based on this whisky collection profile: ${JSON.stringify(userProfile)}, 
                   recommend 5 whisky bottles that this person would enjoy. Include the name, 
                   distillery, flavor profile, and a brief reason for each recommendation.`;

    // Call HuggingFace API
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_length: 1000 } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get recommendations from HuggingFace API',
          status: response.status,
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }
    
    const aiResult = await response.json();
    
    // Process the AI response to format recommendations
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

// Helper function to generate user profile from bottle collection
function generateUserProfile(bottles) {
  // Count regions
  const regions = {};
  bottles.forEach(bottle => {
    if (bottle.region) {
      regions[bottle.region] = (regions[bottle.region] || 0) + 1;
    }
  });
  
  // Analyze flavor profiles
  const flavors = {};
  bottles.forEach(bottle => {
    Object.entries(bottle.flavor_profile).forEach(([flavor, value]) => {
      if (value !== undefined) {
        if (!flavors[flavor]) flavors[flavor] = [];
        flavors[flavor].push(value);
      }
    });
  });
  
  // Calculate average flavor values
  const avgFlavors = {};
  Object.entries(flavors).forEach(([flavor, values]) => {
    avgFlavors[flavor] = values.reduce((sum, val) => sum + val, 0) / values.length;
  });
  
  // Get top distilleries
  const distilleries = {};
  bottles.forEach(bottle => {
    distilleries[bottle.distillery] = (distilleries[bottle.distillery] || 0) + 1;
  });
  
  return {
    favRegions: Object.entries(regions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([region]) => region),
    favFlavors: Object.entries(avgFlavors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([flavor]) => flavor),
    avgPrice: bottles
      .filter(b => b.price)
      .reduce((sum, b) => sum + b.price, 0) / bottles.filter(b => b.price).length,
    favDistilleries: Object.entries(distilleries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([distillery]) => distillery)
  };
}

// Helper function to process AI response into structured recommendations
function processAiRecommendations(aiResult) {
  if (!aiResult || !aiResult[0] || !aiResult[0].generated_text) {
    return [];
  }
  
  const text = aiResult[0].generated_text;
  
  // The AI will produce free-form text, so we'll need to parse it into structured data
  // This is a simplified approach - in production, you might want more robust parsing
  const recommendations = [];
  
  // Split by numbered items or line breaks
  const lines = text.split(/\d+\.\s+|\n+/).filter(line => line.trim().length > 0);
  
  for (let i = 0; i < lines.length && recommendations.length < 5; i++) {
    const line = lines[i];
    
    // Try to extract bottle name and distillery using regex
    const nameMatch = line.match(/([\w\s']+)(?:\s+-\s+|\s+by\s+|,\s+)([\w\s]+)/i);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      const distillery = nameMatch[2].trim();
      
      // Simplified flavor extraction
      const flavors = [];
      if (line.toLowerCase().includes('sweet')) flavors.push('sweet');
      if (line.toLowerCase().includes('smoky')) flavors.push('smoky');
      if (line.toLowerCase().includes('fruity')) flavors.push('fruity');
      if (line.toLowerCase().includes('spicy')) flavors.push('spicy');
      
      recommendations.push({
        name,
        distillery,
        flavor_profile: {
          sweet: flavors.includes('sweet') ? 7 : 4,
          smoky: flavors.includes('smoky') ? 7 : 3,
          fruity: flavors.includes('fruity') ? 7 : 3,
          spicy: flavors.includes('spicy') ? 7 : 3,
        },
        reason: line
      });
    }
  }
  
  // If parsing fails, return a default structure with the raw text
  if (recommendations.length === 0) {
    return [{
      name: "AI Recommendation",
      distillery: "Various",
      flavor_profile: {},
      reason: text
    }];
  }
  
  return recommendations;
}
