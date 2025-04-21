
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function fetchBaxusBarData(username: string) {
  try {
    console.log(`Attempting to fetch bar data for username: ${username}`);
    
    // Call our edge function instead of directly calling the Baxus API
    const { data, error } = await supabase.functions.invoke('baxus-proxy', {
      body: { username }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Error connecting to Baxus service');
    }
    
    // Handle errors returned by the edge function with a 2xx status code but with an error property
    if (data && data.error) {
      console.error('Baxus API error:', data.error);
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Baxus bar data:', error);
    // Extract the error message if it's available
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch bar data';
      
    throw new Error(errorMessage);
  }
}

export async function getAiRecommendations(userBottles: any[]) {
  try {
    console.log(`Getting AI recommendations for ${userBottles.length} bottles`);
    
    if (userBottles.length === 0) {
      throw new Error('Your whisky collection is empty');
    }
    
    // Show loading toast
    toast({
      title: "Processing your collection",
      description: "AI is analyzing your whisky collection...",
    });
    
    const { data, error } = await supabase.functions.invoke('whisky-recommendations', {
      body: { userBottles }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Error getting recommendations');
    }
    
    // Handle errors returned within the success response
    if (data && data.error) {
      console.error('AI recommendation service error:', data.error);
      throw new Error(data.error);
    }
    
    if (!data || !data.recommendations || data.recommendations.length === 0) {
      throw new Error('Could not generate recommendations from your collection');
    }
    
    // Add missing properties to recommendations and ensure prices are properly formatted
    const formattedRecommendations = data.recommendations.map((rec: any) => ({
      bottle: {
        id: `ai-${Math.random().toString(36).substring(2, 9)}`,
        name: rec.name || 'Unknown Whisky',
        distillery: rec.distillery || 'Unknown Distillery',
        country: rec.country || 'AI Recommendation',
        type: rec.type || 'AI Recommendation',
        abv: rec.abv || 43,
        // Ensure price is always a number
        price: typeof rec.price === 'number' ? rec.price : parseFloat(rec.price) || 45.99,
        image_url: rec.image_url || 'https://d1w35me0y6a2bb.cloudfront.net/placeholders/whisky-bottle-placeholder.png',
        flavor_profile: rec.flavor_profile || {
          sweet: 5,
          smoky: 3,
          fruity: 4,
          spicy: 3,
          floral: 2
        },
      },
      reason: rec.reason || 'Based on your collection profile',
    }));
    
    // Successful recommendation generation
    toast({
      title: "Success!",
      description: `Generated ${formattedRecommendations.length} recommendations based on your collection`,
    });
    
    return formattedRecommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Show error toast
    toast({
      title: "Recommendation Failed",
      description: error instanceof Error ? error.message : 'Failed to get AI recommendations',
      variant: "destructive",
    });
    throw error instanceof Error ? error : new Error('Failed to get AI recommendations');
  }
}
