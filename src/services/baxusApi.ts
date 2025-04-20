
import { supabase } from "@/integrations/supabase/client";

export async function fetchBaxusBarData(username: string) {
  try {
    console.log(`Attempting to fetch bar data for username: ${username}`);
    
    // Call our edge function instead of directly calling the Baxus API
    const { data, error } = await supabase.functions.invoke('baxus-proxy', {
      body: { username }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Baxus bar data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch bar data');
  }
}

export async function getAiRecommendations(userBottles: any[]) {
  try {
    console.log(`Getting AI recommendations for ${userBottles.length} bottles`);
    
    if (userBottles.length === 0) {
      throw new Error('Your whisky collection is empty');
    }
    
    const { data, error } = await supabase.functions.invoke('whisky-recommendations', {
      body: { userBottles }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }
    
    if (!data || !data.recommendations) {
      throw new Error('No recommendations received from AI');
    }
    
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get AI recommendations');
  }
}
