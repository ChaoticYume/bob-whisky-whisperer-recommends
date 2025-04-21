
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import { WhiskyBottle } from "@/types/whisky";
import { generateRecommendations } from "@/utils/whiskyAnalysis";
import { getAiRecommendations } from "@/services/baxusApi";
import { useToast } from "@/hooks/use-toast";
import AnalysisHeader from "@/components/AnalysisHeader";
import AnalysisResults from "@/components/AnalysisResults";
import BaxusImport from "@/components/BaxusImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEYS = {
  USER_BOTTLES: 'baxus_user_bottles',
  RECOMMENDATIONS: 'baxus_recommendations',
  ANALYSIS_COMPLETE: 'baxus_analysis_complete'
} as const;

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

const Analyze = () => {
  const [userBottles, setUserBottles] = useState<WhiskyBottle[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_BOTTLES);
    return stored ? JSON.parse(stored) : [];
  });
  
  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return stored ? JSON.parse(stored) : [];
  });
  
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_COMPLETE);
    return stored ? JSON.parse(stored) : false;
  });
  
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_BOTTLES, JSON.stringify(userBottles));
  }, [userBottles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_COMPLETE, JSON.stringify(analysisComplete));
  }, [analysisComplete]);
  
  const handleFileUpload = async (bottles: WhiskyBottle[]) => {
    setErrorMessage(null);
    setUserBottles(bottles);
    
    if (bottles.length === 0) {
      setErrorMessage("Your uploaded collection is empty. Please upload a file with whisky bottle data.");
      return;
    }
    
    const newRecommendations = generateRecommendations(bottles, mockDatabaseBottles);
    setRecommendations(newRecommendations);
    
    if (typeof window !== 'undefined' && (window as any).updateWhiskyRecommendations) {
      (window as any).updateWhiskyRecommendations(newRecommendations);
    }
    
    setAnalysisComplete(true);
    
    toast({
      title: "Collection Processed",
      description: `Analyzed ${bottles.length} bottles and generated ${newRecommendations.length} recommendations.`,
    });
    
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBaxusImport = (bottles: WhiskyBottle[]) => {
    handleFileUpload(bottles);
  };

  const handleAiRecommendations = async () => {
    setErrorMessage(null);
    
    if (userBottles.length === 0) {
      setErrorMessage("Your whisky collection is empty. Please upload your collection first.");
      return;
    }

    try {
      setIsLoadingAi(true);
      
      const aiRecommendations = await getAiRecommendations(userBottles);
      
      if (!aiRecommendations || aiRecommendations.length === 0) {
        setErrorMessage("No AI recommendations could be generated. Try again or use the standard recommendations.");
        return;
      }
      
      const formattedRecommendations = aiRecommendations.map((rec: any) => ({
        bottle: {
          id: `ai-${Math.random().toString(36).substring(2, 9)}`,
          name: rec.name,
          distillery: rec.distillery,
          country: "AI Recommendation",
          type: "AI Recommendation",
          abv: 43,
          flavor_profile: rec.flavor_profile || {},
        },
        reason: rec.reason,
      }));
      
      setRecommendations(formattedRecommendations);
      
      if (typeof window !== 'undefined' && (window as any).updateWhiskyRecommendations) {
        (window as any).updateWhiskyRecommendations(formattedRecommendations);
      }
    } catch (error) {
      console.error("AI recommendation error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to get AI recommendations");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleBottleUpdate = (updatedBottle: WhiskyBottle) => {
    // Update bottle in userBottles if it exists there
    const updatedUserBottles = userBottles.map(bottle => 
      bottle.id === updatedBottle.id ? updatedBottle : bottle
    );
    setUserBottles(updatedUserBottles);
    
    // Update bottle in recommendations if it exists there
    const updatedRecommendations = recommendations.map(rec => 
      rec.bottle.id === updatedBottle.id 
        ? { ...rec, bottle: updatedBottle } 
        : rec
    );
    setRecommendations(updatedRecommendations);
    
    // Update window reference for WhiskyRecommendations component
    if (typeof window !== 'undefined' && (window as any).updateWhiskyRecommendations) {
      (window as any).updateWhiskyRecommendations(updatedRecommendations);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow whisky-bg py-8">
        <div className="container mx-auto px-4">
          <AnalysisHeader errorMessage={errorMessage} />
          
          <div className="mb-16">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                <TabsTrigger value="baxus">Import from Baxus</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FileUpload onUpload={handleFileUpload} />
              </TabsContent>
              <TabsContent value="baxus">
                <BaxusImport onImportComplete={handleBaxusImport} />
              </TabsContent>
            </Tabs>
          </div>
          
          {analysisComplete && (
            <AnalysisResults 
              userBottles={userBottles}
              onGetAiRecommendations={handleAiRecommendations}
              isLoadingAi={isLoadingAi}
              onBottleUpdate={handleBottleUpdate}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
