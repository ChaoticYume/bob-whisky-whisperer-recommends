
import { useState, useEffect } from "react";
import { WhiskyBottle } from "@/types/whisky";
import { Button } from "@/components/ui/button";
import WhiskyCard from "@/components/WhiskyCard";
import RecommendationFilter from "@/components/RecommendationFilter";
import RecommendationSort from "@/components/RecommendationSort";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WhiskyRecommendationsProps {
  userBottles: WhiskyBottle[];
  onGetAiRecommendations: () => void;
  isLoadingAi: boolean;
}

const ITEMS_PER_PAGE = 6;

export default function WhiskyRecommendations({
  userBottles,
  onGetAiRecommendations,
  isLoadingAi
}: WhiskyRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<{ bottle: WhiskyBottle; reason: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasAttemptedRecommendations, setHasAttemptedRecommendations] = useState(false);

  const handleFilterRecommendations = (filtered: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (sorted: { bottle: WhiskyBottle; reason: string }[]) => {
    setFilteredRecommendations(sorted);
  };
  
  const handleGetRecommendations = () => {
    setHasAttemptedRecommendations(true);
    onGetAiRecommendations();
  };

  // This function is called when recommendations are updated from parent
  const updateRecommendations = (newRecs: { bottle: WhiskyBottle; reason: string }[]) => {
    setRecommendations(newRecs);
    setFilteredRecommendations(newRecs);
    setCurrentPage(1); // Reset to first page with new recommendations
    setHasAttemptedRecommendations(true);
  };

  // Expose the updateRecommendations function to the parent component
  if (typeof window !== 'undefined') {
    (window as any).updateWhiskyRecommendations = updateRecommendations;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecommendations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecommendations = filteredRecommendations.slice(startIndex, endIndex);
  
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
              Bob's Recommendations
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
            ) : "Get AI Recommendations"}
          </Button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <RecommendationFilter 
          recommendations={recommendations} 
          onFilter={handleFilterRecommendations} 
        />
      )}
      
      {filteredRecommendations.length > 0 && (
        <RecommendationSort 
          recommendations={filteredRecommendations}
          onSort={handleSort}
        />
      )}
      
      {isLoadingAi && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-whisky-amber" />
            <p className="text-lg font-medium text-whisky-brown">Analyzing your collection...</p>
            <p className="text-whisky-wood/70">Bob is creating personalized recommendations for you</p>
          </div>
        </div>
      )}
      
      {showEmptyState && !isLoadingAi && (
        <div className="py-6">
          <Alert variant="default" className="bg-whisky-amber/5 border-whisky-amber/20">
            <AlertCircle className="h-4 w-4 text-whisky-amber" />
            <AlertTitle className="text-whisky-brown">No matching recommendations</AlertTitle>
            <AlertDescription className="text-whisky-wood/70">
              {recommendations.length === 0 ? (
                <>
                  We couldn't find any recommendations based on your collection data.
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

      {currentRecommendations.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecommendations.map((recommendation) => (
              <WhiskyCard 
                key={recommendation.bottle.id}
                bottle={recommendation.bottle}
                reason={recommendation.reason}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(p => p - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(p => p + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
