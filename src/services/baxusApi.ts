
import { supabase } from "@/integrations/supabase/client";

export async function fetchBaxusBarData(username: string) {
  try {
    // Call our edge function instead of directly calling the Baxus API
    const { data, error } = await supabase.functions.invoke('baxus-proxy', {
      body: { username }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Baxus bar data:', error);
    throw new Error('Failed to fetch bar data');
  }
}

export async function getAiRecommendations(userBottles: any[]) {
  try {
    const { data, error } = await supabase.functions.invoke('whisky-recommendations', {
      body: { userBottles }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to get AI recommendations');
  }
}
