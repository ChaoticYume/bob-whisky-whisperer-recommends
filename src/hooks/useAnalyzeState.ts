import { useState, useEffect } from "react";
import { WhiskyBottle } from "@/types/whisky";

const STORAGE_KEYS = {
  USER_BOTTLES: "baxus_user_bottles",
  RECOMMENDATIONS: "baxus_recommendations",
  ANALYSIS_COMPLETE: "baxus_analysis_complete",
} as const;

// Mock database bottles for offline/analysis
const mockDatabaseBottles: WhiskyBottle[] = [
  {
    id: "db001",
    name: "Highland Park 18",
    distillery: "Highland Park",
    region: "Islands",
    country: "Scotland",
    type: "Single Malt",
    age: 18,
    abv: 43,
    price: 150,
    flavor_profile: {
      smoky: 5,
      peaty: 4,
      spicy: 6,
      herbal: 5,
      oily: 6,
      body: 7,
      rich: 8,
      sweet: 7,
      salty: 4,
      vanilla: 6,
      fruity: 5,
      floral: 4
    }
  },
  {
    id: "db002",
    name: "Ardbeg 10",
    distillery: "Ardbeg",
    region: "Islay",
    country: "Scotland",
    type: "Single Malt",
    age: 10,
    abv: 46,
    price: 55,
    flavor_profile: {
      smoky: 9,
      peaty: 10,
      spicy: 5,
      herbal: 4,
      oily: 7,
      body: 6,
      rich: 7,
      sweet: 3,
      salty: 7,
      vanilla: 4,
      fruity: 2,
      floral: 1
    }
  },
  {
    id: "db003",
    name: "Macallan 12 Double Cask",
    distillery: "Macallan",
    region: "Speyside",
    country: "Scotland",
    type: "Single Malt",
    age: 12,
    abv: 40,
    price: 65,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 4,
      herbal: 3,
      oily: 5,
      body: 6,
      rich: 7,
      sweet: 8,
      salty: 2,
      vanilla: 7,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db004",
    name: "Buffalo Trace",
    distillery: "Buffalo Trace",
    region: "Kentucky",
    country: "USA",
    type: "Bourbon",
    abv: 45,
    price: 30,
    flavor_profile: {
      smoky: 2,
      peaty: 0,
      spicy: 5,
      herbal: 2,
      oily: 4,
      body: 5,
      rich: 6,
      sweet: 7,
      salty: 1,
      vanilla: 8,
      fruity: 4,
      floral: 2
    }
  },
  {
    id: "db005",
    name: "Hibiki Harmony",
    distillery: "Suntory",
    country: "Japan",
    type: "Blended",
    abv: 43,
    price: 85,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 4,
      herbal: 6,
      oily: 4,
      body: 6,
      rich: 5,
      sweet: 6,
      salty: 2,
      vanilla: 5,
      fruity: 7,
      floral: 8
    }
  },
  {
    id: "db006",
    name: "GlenDronach 15 Revival",
    distillery: "GlenDronach",
    region: "Highlands",
    country: "Scotland",
    type: "Single Malt",
    age: 15,
    abv: 46,
    price: 95,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 6,
      herbal: 3,
      oily: 7,
      body: 8,
      rich: 9,
      sweet: 8,
      salty: 2,
      vanilla: 6,
      fruity: 7,
      floral: 3
    }
  },
  {
    id: "db007",
    name: "Redbreast 12 Cask Strength",
    distillery: "Midleton",
    country: "Ireland",
    type: "Single Pot Still",
    age: 12,
    abv: 57.2,
    price: 85,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 7,
      herbal: 5,
      oily: 6,
      body: 7,
      rich: 8,
      sweet: 7,
      salty: 1,
      vanilla: 6,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db008",
    name: "Nikka From The Barrel",
    distillery: "Nikka",
    country: "Japan",
    type: "Blended",
    abv: 51.4,
    price: 65,
    flavor_profile: {
      smoky: 3,
      peaty: 2,
      spicy: 6,
      herbal: 4,
      oily: 6,
      body: 7,
      rich: 6,
      sweet: 5,
      salty: 3,
      vanilla: 5,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db009",
    name: "Lagavulin 16",
    distillery: "Lagavulin",
    region: "Islay",
    country: "Scotland",
    type: "Single Malt",
    age: 16,
    abv: 43,
    price: 90,
    flavor_profile: {
      smoky: 9,
      peaty: 9,
      spicy: 5,
      herbal: 4,
      oily: 7,
      body: 8,
      rich: 7,
      sweet: 4,
      salty: 6,
      vanilla: 3,
      fruity: 3,
      floral: 2
    }
  },
  {
    id: "db010",
    name: "Blanton's Original",
    distillery: "Buffalo Trace",
    region: "Kentucky",
    country: "USA",
    type: "Bourbon",
    abv: 46.5,
    price: 65,
    flavor_profile: {
      smoky: 2,
      peaty: 0,
      spicy: 6,
      herbal: 3,
      oily: 5,
      body: 6,
      rich: 7,
      sweet: 8,
      salty: 1,
      vanilla: 8,
      fruity: 5,
      floral: 3
    }
  },
  {
    id: "db011",
    name: "Aberlour A'bunadh",
    distillery: "Aberlour",
    region: "Speyside",
    country: "Scotland",
    type: "Single Malt",
    abv: 59.6,
    price: 85,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 6,
      herbal: 2,
      oily: 7,
      body: 8,
      rich: 9,
      sweet: 8,
      salty: 1,
      vanilla: 6,
      fruity: 7,
      floral: 3
    }
  },
  {
    id: "db012",
    name: "Yamazaki 12",
    distillery: "Suntory Yamazaki",
    country: "Japan",
    type: "Single Malt",
    age: 12,
    abv: 43,
    price: 120,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 5,
      herbal: 6,
      oily: 5,
      body: 6,
      rich: 6,
      sweet: 7,
      salty: 2,
      vanilla: 5,
      fruity: 8,
      floral: 7
    }
  }
];

function useAnalyzeState() {
  const [userBottles, setUserBottles] = useState<WhiskyBottle[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_BOTTLES);
    return stored ? JSON.parse(stored) : [];
  });

  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
      return stored ? JSON.parse(stored) : [];
    }
  );

  const [analysisComplete, setAnalysisComplete] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_COMPLETE);
    return stored ? JSON.parse(stored) : false;
  });

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_BOTTLES, JSON.stringify(userBottles));
  }, [userBottles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_COMPLETE, JSON.stringify(analysisComplete));
  }, [analysisComplete]);

  return {
    userBottles,
    setUserBottles,
    recommendations,
    setRecommendations,
    analysisComplete,
    setAnalysisComplete,
    isLoadingAi,
    setIsLoadingAi,
    errorMessage,
    setErrorMessage,
    mockDatabaseBottles,
  };
}
useAnalyzeState.mockDatabaseBottles = [
  {
    id: "db001",
    name: "Highland Park 18",
    distillery: "Highland Park",
    region: "Islands",
    country: "Scotland",
    type: "Single Malt",
    age: 18,
    abv: 43,
    price: 150,
    flavor_profile: {
      smoky: 5,
      peaty: 4,
      spicy: 6,
      herbal: 5,
      oily: 6,
      body: 7,
      rich: 8,
      sweet: 7,
      salty: 4,
      vanilla: 6,
      fruity: 5,
      floral: 4
    }
  },
  {
    id: "db002",
    name: "Ardbeg 10",
    distillery: "Ardbeg",
    region: "Islay",
    country: "Scotland",
    type: "Single Malt",
    age: 10,
    abv: 46,
    price: 55,
    flavor_profile: {
      smoky: 9,
      peaty: 10,
      spicy: 5,
      herbal: 4,
      oily: 7,
      body: 6,
      rich: 7,
      sweet: 3,
      salty: 7,
      vanilla: 4,
      fruity: 2,
      floral: 1
    }
  },
  {
    id: "db003",
    name: "Macallan 12 Double Cask",
    distillery: "Macallan",
    region: "Speyside",
    country: "Scotland",
    type: "Single Malt",
    age: 12,
    abv: 40,
    price: 65,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 4,
      herbal: 3,
      oily: 5,
      body: 6,
      rich: 7,
      sweet: 8,
      salty: 2,
      vanilla: 7,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db004",
    name: "Buffalo Trace",
    distillery: "Buffalo Trace",
    region: "Kentucky",
    country: "USA",
    type: "Bourbon",
    abv: 45,
    price: 30,
    flavor_profile: {
      smoky: 2,
      peaty: 0,
      spicy: 5,
      herbal: 2,
      oily: 4,
      body: 5,
      rich: 6,
      sweet: 7,
      salty: 1,
      vanilla: 8,
      fruity: 4,
      floral: 2
    }
  },
  {
    id: "db005",
    name: "Hibiki Harmony",
    distillery: "Suntory",
    country: "Japan",
    type: "Blended",
    abv: 43,
    price: 85,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 4,
      herbal: 6,
      oily: 4,
      body: 6,
      rich: 5,
      sweet: 6,
      salty: 2,
      vanilla: 5,
      fruity: 7,
      floral: 8
    }
  },
  {
    id: "db006",
    name: "GlenDronach 15 Revival",
    distillery: "GlenDronach",
    region: "Highlands",
    country: "Scotland",
    type: "Single Malt",
    age: 15,
    abv: 46,
    price: 95,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 6,
      herbal: 3,
      oily: 7,
      body: 8,
      rich: 9,
      sweet: 8,
      salty: 2,
      vanilla: 6,
      fruity: 7,
      floral: 3
    }
  },
  {
    id: "db007",
    name: "Redbreast 12 Cask Strength",
    distillery: "Midleton",
    country: "Ireland",
    type: "Single Pot Still",
    age: 12,
    abv: 57.2,
    price: 85,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 7,
      herbal: 5,
      oily: 6,
      body: 7,
      rich: 8,
      sweet: 7,
      salty: 1,
      vanilla: 6,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db008",
    name: "Nikka From The Barrel",
    distillery: "Nikka",
    country: "Japan",
    type: "Blended",
    abv: 51.4,
    price: 65,
    flavor_profile: {
      smoky: 3,
      peaty: 2,
      spicy: 6,
      herbal: 4,
      oily: 6,
      body: 7,
      rich: 6,
      sweet: 5,
      salty: 3,
      vanilla: 5,
      fruity: 6,
      floral: 4
    }
  },
  {
    id: "db009",
    name: "Lagavulin 16",
    distillery: "Lagavulin",
    region: "Islay",
    country: "Scotland",
    type: "Single Malt",
    age: 16,
    abv: 43,
    price: 90,
    flavor_profile: {
      smoky: 9,
      peaty: 9,
      spicy: 5,
      herbal: 4,
      oily: 7,
      body: 8,
      rich: 7,
      sweet: 4,
      salty: 6,
      vanilla: 3,
      fruity: 3,
      floral: 2
    }
  },
  {
    id: "db010",
    name: "Blanton's Original",
    distillery: "Buffalo Trace",
    region: "Kentucky",
    country: "USA",
    type: "Bourbon",
    abv: 46.5,
    price: 65,
    flavor_profile: {
      smoky: 2,
      peaty: 0,
      spicy: 6,
      herbal: 3,
      oily: 5,
      body: 6,
      rich: 7,
      sweet: 8,
      salty: 1,
      vanilla: 8,
      fruity: 5,
      floral: 3
    }
  },
  {
    id: "db011",
    name: "Aberlour A'bunadh",
    distillery: "Aberlour",
    region: "Speyside",
    country: "Scotland",
    type: "Single Malt",
    abv: 59.6,
    price: 85,
    flavor_profile: {
      smoky: 1,
      peaty: 0,
      spicy: 6,
      herbal: 2,
      oily: 7,
      body: 8,
      rich: 9,
      sweet: 8,
      salty: 1,
      vanilla: 6,
      fruity: 7,
      floral: 3
    }
  },
  {
    id: "db012",
    name: "Yamazaki 12",
    distillery: "Suntory Yamazaki",
    country: "Japan",
    type: "Single Malt",
    age: 12,
    abv: 43,
    price: 120,
    flavor_profile: {
      smoky: 2,
      peaty: 1,
      spicy: 5,
      herbal: 6,
      oily: 5,
      body: 6,
      rich: 6,
      sweet: 7,
      salty: 2,
      vanilla: 5,
      fruity: 8,
      floral: 7
    }
  }
];

export default useAnalyzeState;
