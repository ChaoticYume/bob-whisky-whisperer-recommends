
import WhiskyCard from "@/components/WhiskyCard";
import { WhiskyBottle } from "@/types/whisky";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface RecommendationListProps {
  recommendations: { bottle: WhiskyBottle; reason: string }[];
  onBottleUpdate?: (bottle: WhiskyBottle) => void;
  itemsPerPage?: number;
}

const RecommendationList = ({
  recommendations,
  onBottleUpdate,
  itemsPerPage = 6,
}: RecommendationListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const current = recommendations.slice(startIndex, endIndex);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((rec) => (
          <WhiskyCard
            key={rec.bottle.id}
            bottle={rec.bottle}
            reason={rec.reason}
            onUpdate={onBottleUpdate}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage((p) => p - 1)} />
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
                <PaginationNext onClick={() => setCurrentPage((p) => p + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default RecommendationList;
