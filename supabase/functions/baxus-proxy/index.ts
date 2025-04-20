
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
    const { username } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching bar data for username: ${username}`);
    const response = await fetch(`http://services.baxus.co/api/bar/user/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Handle Baxus API responses based on status code
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`Baxus API error: ${response.status} - ${JSON.stringify(errorData)}`);
      
      // Parse and return more user-friendly error messages
      let errorMessage = 'Failed to fetch data from Baxus API';
      if (errorData?.message) {
        if (errorData.message.includes("public share settings disabled")) {
          errorMessage = "This Baxus user has disabled public sharing. Ask them to enable it in their Baxus settings.";
        } else if (errorData.message.includes("not found")) {
          errorMessage = "This Baxus username was not found. Please check the spelling and try again.";
        } else {
          errorMessage = errorData.message;
        }
      }
      
      // Return a 200 status with detailed error info to handle gracefully in the frontend
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          status: response.status,
          originalError: errorData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    const data = await response.json();
    
    // Check if the bar data is empty
    if (!data || !data.bottles || data.bottles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No bottles found in this Baxus bar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
