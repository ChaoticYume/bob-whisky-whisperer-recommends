
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import CollectionSummary from "@/components/CollectionSummary";
import WhiskyCard from "@/components/WhiskyCard";
import RecommendationFilter from "@/components/RecommendationFilter";
import { WhiskyBottle } from "@/types/whisky";
import { generateRecommendations } from "@/utils/whiskyAnalysis";
import { getAiRecommendations } from "@/services/baxusApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const [userBottles, setUserBottles] = useState<WhiskyBottle[]>([]);
  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (bottles: WhiskyBottle[]) => {
    setUserBottles(bottles);
    
    // Generate recommendations based on uploaded collection
    const newRecommendations = generateRecommendations(bottles, mockDatabaseBottles);
    setRecommendations(newRecommendations);
    setFilteredRecommendations(newRecommendations);
    setAnalysisComplete(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleFilterRecommendations = (filtered: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(filtered);
  };

  const handleAiRecommendations = async () => {
    if (userBottles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload your collection first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingAi(true);
      toast({
        title: "Processing",
        description: "Getting AI recommendations based on your collection...",
      });

      const aiRecommendations = await getAiRecommendations(userBottles);
      
      // Convert AI recommendations to the format expected by the UI
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
      setFilteredRecommendations(formattedRecommendations);
      
      toast({
        title: "Success!",
        description: "AI recommendations generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAi(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow whisky-bg py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-whisky-brown mb-4">
              Analyze Your Whisky Collection
            </h1>
            <p className="text-whisky-wood/80">
              Upload your whisky collection data in CSV format, and Bob will analyze your preferences 
              and recommend new bottles that perfectly match your taste profile.
            </p>
          </div>
          
          <div className="mb-16">
            <FileUpload onUpload={handleFileUpload} />
          </div>
          
          {analysisComplete && (
            <div id="results" className="space-y-16 pt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-whisky-brown mb-6">
                  Your Collection Analysis
                </h2>
                
                <CollectionSummary bottles={userBottles} />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-whisky-amber flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white text-xl">B</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-whisky-brown">
                        Bob's Recommendations
                      </h2>
                      <p className="text-whisky-wood/70">
                        Based on your collection, I think you might enjoy these bottles:
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      onClick={handleAiRecommendations} 
                      disabled={isLoadingAi}
                      className="bg-whisky-gold hover:bg-whisky-amber text-white"
                    >
                      {isLoadingAi ? "Getting AI Recommendations..." : "Get AI Recommendations"}
                    </Button>
                  </div>
                </div>
                
                <RecommendationFilter 
                  recommendations={recommendations} 
                  onFilter={handleFilterRecommendations} 
                />
                
                {filteredRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecommendations.map((recommendation) => (
                      <WhiskyCard 
                        key={recommendation.bottle.id}
                        bottle={recommendation.bottle}
                        reason={recommendation.reason}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-whisky-wood/70">No recommendations match your filters.</p>
                    <p className="text-whisky-wood/70 mt-1">Try adjusting your filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
