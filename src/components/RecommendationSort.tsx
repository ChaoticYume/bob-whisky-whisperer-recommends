
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpWideNarrow, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WhiskyBottle } from "@/types/whisky";

type SortOption = "price" | "age" | "abv" | "name";
type SortDirection = "asc" | "desc";

interface RecommendationSortProps {
  recommendations: { bottle: WhiskyBottle; reason: string }[];
  onSort: (sorted: { bottle: WhiskyBottle; reason: string }[]) => void;
}

export default function RecommendationSort({ recommendations, onSort }: RecommendationSortProps) {
  const handleSort = (option: SortOption, direction: SortDirection = "desc") => {
    const sorted = [...recommendations].sort((a, b) => {
      let comparison = 0;
      
      switch (option) {
        case "price":
          comparison = ((b.bottle.price || 0) - (a.bottle.price || 0));
          break;
        case "age":
          comparison = ((b.bottle.age || 0) - (a.bottle.age || 0));
          break;
        case "abv":
          comparison = b.bottle.abv - a.bottle.abv;
          break;
        case "name":
          comparison = a.bottle.name.localeCompare(b.bottle.name);
          break;
        default:
          return 0;
      }
      
      return direction === "asc" ? -comparison : comparison;
    });
    
    onSort(sorted);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 bg-white/50 p-2 rounded-md">
      <span className="text-sm text-whisky-wood/80 font-medium">Sort by:</span>
      
      <ToggleGroup type="single" className="justify-start">
        <ToggleGroupItem value="price" onClick={() => handleSort("price")} className="flex gap-1 items-center">
          <ArrowDownWideNarrow className="h-3.5 w-3.5" />
          <span>Price</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem value="age" onClick={() => handleSort("age")} className="flex gap-1 items-center">
          <ArrowDownWideNarrow className="h-3.5 w-3.5" />
          <span>Age</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem value="abv" onClick={() => handleSort("abv")} className="flex gap-1 items-center">
          <Percent className="h-3.5 w-3.5" />
          <span>ABV</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem value="name" onClick={() => handleSort("name", "asc")} className="flex gap-1 items-center">
          <ArrowDownAZ className="h-3.5 w-3.5" />
          <span>Name</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
