
import { WhiskyBottle } from "@/types/whisky";
import CollectionSummary from "@/components/CollectionSummary";
import WhiskyRecommendations from "@/components/WhiskyRecommendations";

interface AnalysisResultsProps {
  userBottles: WhiskyBottle[];
  onGetAiRecommendations: () => void;
  isLoadingAi: boolean;
  onBottleUpdate?: (bottle: WhiskyBottle) => void;
}

export default function AnalysisResults({ 
  userBottles, 
  onGetAiRecommendations,
  isLoadingAi,
  onBottleUpdate
}: AnalysisResultsProps) {
  return (
    <div id="results" className="space-y-16 pt-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-whisky-brown mb-6">
          Your Collection Analysis
        </h2>
        
        <CollectionSummary bottles={userBottles} />
      </div>
      
      <WhiskyRecommendations 
        userBottles={userBottles}
        onGetAiRecommendations={onGetAiRecommendations}
        isLoadingAi={isLoadingAi}
        onBottleUpdate={onBottleUpdate}
      />
    </div>
  );
}
