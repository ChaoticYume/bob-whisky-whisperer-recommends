
import { Button } from "@/components/ui/button";
import { WhiskyBottle } from "@/types/whisky";

type SortOption = "price" | "age" | "abv" | "name";

interface RecommendationSortProps {
  recommendations: { bottle: WhiskyBottle; reason: string }[];
  onSort: (sorted: { bottle: WhiskyBottle; reason: string }[]) => void;
}

export default function RecommendationSort({ recommendations, onSort }: RecommendationSortProps) {
  const handleSort = (option: SortOption) => {
    const sorted = [...recommendations].sort((a, b) => {
      switch (option) {
        case "price":
          return (b.bottle.price || 0) - (a.bottle.price || 0);
        case "age":
          return (b.bottle.age || 0) - (a.bottle.age || 0);
        case "abv":
          return b.bottle.abv - a.bottle.abv;
        case "name":
          return a.bottle.name.localeCompare(b.bottle.name);
        default:
          return 0;
      }
    });
    onSort(sorted);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm text-whisky-wood/70 self-center">Sort by:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleSort("price")}
        className="border-whisky-amber/30 text-whisky-brown"
      >
        Price
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleSort("age")}
        className="border-whisky-amber/30 text-whisky-brown"
      >
        Age
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleSort("abv")}
        className="border-whisky-amber/30 text-whisky-brown"
      >
        ABV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleSort("name")}
        className="border-whisky-amber/30 text-whisky-brown"
      >
        Name
      </Button>
    </div>
  );
}
