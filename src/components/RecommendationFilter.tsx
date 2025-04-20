
import { useState, useEffect } from "react";
import { WhiskyBottle } from "@/types/whisky";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";

interface RecommendationFilterProps {
  recommendations: { bottle: WhiskyBottle; reason: string }[];
  onFilter: (filtered: { bottle: WhiskyBottle; reason: string }[]) => void;
}

const RecommendationFilter = ({ recommendations, onFilter }: RecommendationFilterProps) => {
  // Extract all available regions and types
  const allRegions = Array.from(
    new Set(
      recommendations
        .map((r) => r.bottle.region)
        .filter((region): region is string => region !== undefined)
    )
  );
  
  const allTypes = Array.from(
    new Set(recommendations.map((r) => r.bottle.type))
  );
  
  // Calculate price min and max from recommendations
  const prices = recommendations
    .map((r) => r.bottle.price)
    .filter((price): price is number => price !== undefined && price > 0);
  
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 200;
  
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Reset price range when recommendations change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);
  
  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) => 
      prev.includes(region) 
        ? prev.filter((r) => r !== region) 
        : [...prev, region]
    );
  };
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => 
      prev.includes(type) 
        ? prev.filter((t) => t !== type) 
        : [...prev, type]
    );
  };
  
  const applyFilters = () => {
    let filtered = [...recommendations];
    
    // Filter by price
    filtered = filtered.filter((r) => {
      const price = r.bottle.price;
      if (price === undefined || price <= 0) return true;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Filter by region
    if (selectedRegions.length > 0) {
      filtered = filtered.filter((r) => 
        r.bottle.region && selectedRegions.includes(r.bottle.region)
      );
    }
    
    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((r) => 
        selectedTypes.includes(r.bottle.type)
      );
    }
    
    onFilter(filtered);
  };
  
  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedRegions([]);
    setSelectedTypes([]);
    onFilter(recommendations); // Reset to original recommendations
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-whisky-amber/10 mb-6">
      <div className="flex items-center gap-2 font-medium text-whisky-brown mb-4">
        <SlidersHorizontal className="h-4 w-4" />
        <h3>Filter Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-whisky-wood mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</p>
          <Slider
            value={priceRange}
            min={minPrice}
            max={maxPrice || 200}
            step={5}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="mb-2"
          />
        </div>
        
        {allRegions.length > 0 && (
          <div>
            <p className="text-sm text-whisky-wood mb-2">Regions:</p>
            <div className="flex flex-wrap gap-2">
              {allRegions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegions.includes(region) ? "default" : "outline"}
                  onClick={() => handleRegionToggle(region)}
                  className={selectedRegions.includes(region) 
                    ? "bg-whisky-amber hover:bg-whisky-gold"
                    : "border-whisky-amber/30 text-whisky-brown"
                  }
                  size="sm"
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm text-whisky-wood mb-2">Types:</p>
          <div className="flex flex-wrap gap-2">
            {allTypes.map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                onClick={() => handleTypeToggle(type)}
                className={selectedTypes.includes(type) 
                  ? "bg-whisky-amber hover:bg-whisky-gold"
                  : "border-whisky-amber/30 text-whisky-brown"
                }
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={applyFilters}
            className="bg-whisky-amber hover:bg-whisky-gold text-white"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-whisky-amber/30 text-whisky-brown"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationFilter;
