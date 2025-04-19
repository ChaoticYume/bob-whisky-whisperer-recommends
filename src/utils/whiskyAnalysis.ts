
import { WhiskyBottle } from "../types/whisky";

// Helper to calculate the average value for a property across bottles
export const calculateAverage = (bottles: WhiskyBottle[], property: keyof WhiskyBottle) => {
  const validBottles = bottles.filter(bottle => bottle[property] !== undefined);
  if (validBottles.length === 0) return 0;
  
  const sum = validBottles.reduce((total, bottle) => {
    const value = bottle[property] as number;
    return total + (value || 0);
  }, 0);
  
  return sum / validBottles.length;
};

// Analyze flavor profile across all bottles
export const analyzeFlavorProfile = (bottles: WhiskyBottle[]) => {
  const flavorProfile: Record<string, number> = {};
  const flavorCount: Record<string, number> = {};
  
  bottles.forEach(bottle => {
    Object.entries(bottle.flavor_profile).forEach(([flavor, value]) => {
      if (value !== undefined) {
        flavorProfile[flavor] = (flavorProfile[flavor] || 0) + value;
        flavorCount[flavor] = (flavorCount[flavor] || 0) + 1;
      }
    });
  });
  
  // Calculate averages
  Object.keys(flavorProfile).forEach(flavor => {
    flavorProfile[flavor] = flavorProfile[flavor] / flavorCount[flavor];
  });
  
  return flavorProfile;
};

// Analyze regions represented in the collection
export const analyzeRegions = (bottles: WhiskyBottle[]) => {
  const regions: Record<string, number> = {};
  
  bottles.forEach(bottle => {
    if (bottle.region) {
      regions[bottle.region] = (regions[bottle.region] || 0) + 1;
    }
  });
  
  return regions;
};

// Calculate price distribution
export const analyzePriceDistribution = (bottles: WhiskyBottle[]) => {
  const bottlesWithPrice = bottles.filter(bottle => bottle.price !== undefined);
  
  if (bottlesWithPrice.length === 0) return { average: 0, min: 0, max: 0 };
  
  const prices = bottlesWithPrice.map(bottle => bottle.price as number);
  
  return {
    average: prices.reduce((a, b) => a + b, 0) / prices.length,
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Get top distilleries in the collection
export const getTopDistilleries = (bottles: WhiskyBottle[]) => {
  const distilleries: Record<string, number> = {};
  
  bottles.forEach(bottle => {
    distilleries[bottle.distillery] = (distilleries[bottle.distillery] || 0) + 1;
  });
  
  return Object.entries(distilleries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([distillery, count]) => ({ distillery, count }));
};

// Generate personalized recommendations based on collection analysis
export const generateRecommendations = (
  userBottles: WhiskyBottle[], 
  allBottles: WhiskyBottle[]
): { bottle: WhiskyBottle; reason: string }[] => {
  if (userBottles.length === 0) return [];
  
  const userFlavorProfile = analyzeFlavorProfile(userBottles);
  const priceRange = analyzePriceDistribution(userBottles);
  const topDistilleries = getTopDistilleries(userBottles);
  const favoriteRegions = analyzeRegions(userBottles);
  
  // Filter out bottles already in the user's collection
  const userBottleIds = new Set(userBottles.map(bottle => bottle.id));
  const availableBottles = allBottles.filter(bottle => !userBottleIds.has(bottle.id));
  
  // Score each available bottle
  const scoredBottles = availableBottles.map(bottle => {
    let score = 0;
    let reason = "";
    
    // Check if from a favorite distillery
    const isFromFavoriteDistillery = topDistilleries.some(
      d => d.distillery === bottle.distillery
    );
    
    if (isFromFavoriteDistillery) {
      score += 5;
      reason = `From ${bottle.distillery}, one of your favorite distilleries. `;
    }
    
    // Check if in a preferred region
    if (bottle.region && favoriteRegions[bottle.region]) {
      score += 3;
      reason += `From ${bottle.region}, a region you enjoy. `;
    }
    
    // Check if in a similar price range
    if (bottle.price && bottle.price >= priceRange.min * 0.8 && bottle.price <= priceRange.max * 1.2) {
      score += 2;
      reason += `In your usual price range. `;
    }
    
    // Check flavor profile similarity
    let flavorScore = 0;
    let matchingFlavors: string[] = [];
    
    Object.entries(bottle.flavor_profile).forEach(([flavor, value]) => {
      if (value !== undefined && userFlavorProfile[flavor] !== undefined) {
        // Calculate similarity (less difference = higher score)
        const similarity = 1 - Math.min(Math.abs(value - userFlavorProfile[flavor]) / 10, 1);
        flavorScore += similarity;
        
        if (similarity > 0.8) {
          matchingFlavors.push(flavor);
        }
      }
    });
    
    if (matchingFlavors.length > 0) {
      score += flavorScore / Object.keys(bottle.flavor_profile).length * 10;
      reason += `Has flavor notes (${matchingFlavors.join(", ")}) similar to your collection. `;
    }
    
    // Add some randomness to diversify recommendations
    score += Math.random() * 2;
    
    return { 
      bottle, 
      score, 
      reason: reason || "A great addition to your collection."
    };
  });
  
  // Sort by score and take top results
  return scoredBottles
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ bottle, reason }) => ({ bottle, reason }));
};
