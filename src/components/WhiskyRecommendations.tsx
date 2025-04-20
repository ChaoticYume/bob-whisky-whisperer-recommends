
import { useState } from "react";
import { WhiskyBottle } from "@/types/whisky";
import { Button } from "@/components/ui/button";
import WhiskyCard from "@/components/WhiskyCard";
import RecommendationFilter from "@/components/RecommendationFilter";

interface WhiskyRecommendationsProps {
  userBottles: WhiskyBottle[];
  onGetAiRecommendations: () => void;
  isLoadingAi: boolean;
}

export default function WhiskyRecommendations({
  userBottles,
  onGetAiRecommendations,
  isLoadingAi
}: WhiskyRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);

  const handleFilterRecommendations = (filtered: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(filtered);
  };

  // This function is called when recommendations are updated from parent
  const updateRecommendations = (newRecs: { bottle: WhiskyBottle; reason: string }[]) => {
    setRecommendations(newRecs);
    setFilteredRecommendations(newRecs);
  };

  // Expose the updateRecommendations function to the parent component
  if (typeof window !== 'undefined') {
    (window as any).updateWhiskyRecommendations = updateRecommendations;
  }

  return (
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
            onClick={onGetAiRecommendations}
            disabled={isLoadingAi || userBottles.length === 0}
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
          <p className="text-whisky-wood/70 mt-1">Try adjusting your filter criteria or getting AI recommendations.</p>
        </div>
      )}
    </div>
  );
}
