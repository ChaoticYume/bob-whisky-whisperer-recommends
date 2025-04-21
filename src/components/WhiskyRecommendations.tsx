
import { useState } from "react";
import { WhiskyBottle } from "@/types/whisky";
import { Button } from "@/components/ui/button";
import RecommendationFilter from "@/components/RecommendationFilter";
import RecommendationSort from "@/components/RecommendationSort";
import RecommendationList from "./RecommendationList";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Bob's Recommendations Panel
interface WhiskyRecommendationsProps {
  userBottles: WhiskyBottle[];
  onGetAiRecommendations: () => void;
  isLoadingAi: boolean;
  onBottleUpdate?: (bottle: WhiskyBottle) => void;
}

const ITEMS_PER_PAGE = 6;

export default function WhiskyRecommendations({
  userBottles,
  onGetAiRecommendations,
  isLoadingAi,
  onBottleUpdate,
}: WhiskyRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [hasAttemptedRecommendations, setHasAttemptedRecommendations] = useState(false);

  const handleFilterRecommendations = (filtered: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(filtered);
  };

  const handleSort = (sorted: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(sorted);
  };

  const handleGetRecommendations = () => {
    setHasAttemptedRecommendations(true);
    onGetAiRecommendations();
  };

  const handleBottleUpdate = (updatedBottle: WhiskyBottle) => {
    if (onBottleUpdate) {
      onBottleUpdate(updatedBottle);
    }

    // Update local recommendations state as well
    setRecommendations(recommendations =>
      recommendations.map(rec =>
        rec.bottle.id === updatedBottle.id ? { ...rec, bottle: updatedBottle } : rec
      )
    );
    setFilteredRecommendations(filteredRecommendations =>
      filteredRecommendations.map(rec =>
        rec.bottle.id === updatedBottle.id ? { ...rec, bottle: updatedBottle } : rec
      )
    );
  };

  // Expose the updateRecommendations function to the parent window for inter-component updates
  if (typeof window !== "undefined") {
    (window as any).updateWhiskyRecommendations = (newRecs: { bottle: WhiskyBottle; reason: string }[]) => {
      setRecommendations(newRecs);
      setFilteredRecommendations(newRecs);
      setHasAttemptedRecommendations(true);
    };
  }

  const showEmptyState = hasAttemptedRecommendations && filteredRecommendations.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-whisky-amber flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-white text-xl">B</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-whisky-brown">
              Bob&#39;s Recommendations
            </h2>
            <p className="text-whisky-wood/70">
              Based on your collection, I think you might enjoy these bottles:
            </p>
          </div>
        </div>
        <div>
          <Button
            onClick={handleGetRecommendations}
            disabled={isLoadingAi || userBottles.length === 0}
            className="bg-whisky-gold hover:bg-whisky-amber text-white"
          >
            {isLoadingAi ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting AI Recommendations...
              </span>
            ) : (
              "Get AI Recommendations"
            )}
          </Button>
        </div>
      </div>
      {recommendations.length > 0 && (
        <RecommendationFilter recommendations={recommendations} onFilter={handleFilterRecommendations} />
      )}
      {filteredRecommendations.length > 0 && (
        <RecommendationSort recommendations={filteredRecommendations} onSort={handleSort} />
      )}
      {isLoadingAi && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-whisky-amber" />
            <p className="text-lg font-medium text-whisky-brown">
              Analyzing your collection...
            </p>
            <p className="text-whisky-wood/70">
              Bob is creating personalized recommendations for you
            </p>
          </div>
        </div>
      )}
      {showEmptyState && !isLoadingAi && (
        <div className="py-6">
          <Alert variant="default" className="bg-whisky-amber/5 border-whisky-amber/20">
            <AlertCircle className="h-4 w-4 text-whisky-amber" />
            <AlertTitle className="text-whisky-brown">
              No matching recommendations
            </AlertTitle>
            <AlertDescription className="text-whisky-wood/70">
              {recommendations.length === 0 ? (
                <>
                  We couldn&#39;t find any recommendations based on your collection data.
                  <br />
                  This can happen if your collection data is missing key information like flavor profiles.
                </>
              ) : (
                <>
                  No recommendations match your current filter criteria.
                  <br />
                  Try adjusting your filters or resetting them to see all recommendations.
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {filteredRecommendations.length > 0 && (
        <RecommendationList
          recommendations={filteredRecommendations}
          onBottleUpdate={handleBottleUpdate}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
