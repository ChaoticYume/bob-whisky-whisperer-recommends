
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
      throw new Error(error.message);
    }
    
    // Handle errors returned within the success response
    if (data && data.error) {
      console.error('AI recommendation service error:', data.error);
      throw new Error(data.error);
    }
    
    if (!data || !data.recommendations || data.recommendations.length === 0) {
      throw new Error('Could not generate recommendations from your collection');
    }
    
    // Successful recommendation generation
    toast({
      title: "Success!",
      description: `Generated ${data.recommendations.length} recommendations based on your collection`,
    });
    
    return data.recommendations;
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
