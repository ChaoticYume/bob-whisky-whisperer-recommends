
import { WhiskyBottle } from "@/types/whisky";
import { 
  analyzeFlavorProfile, 
  analyzeRegions, 
  analyzePriceDistribution,
  getTopDistilleries
} from "@/utils/whiskyAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CollectionSummaryProps {
  bottles: WhiskyBottle[];
}

const CollectionSummary = ({ bottles }: CollectionSummaryProps) => {
  const flavorProfile = analyzeFlavorProfile(bottles);
  const regions = analyzeRegions(bottles);
  const priceDistribution = analyzePriceDistribution(bottles);
  const topDistilleries = getTopDistilleries(bottles);
  
  // Prepare data for chart display
  const sortedFlavorProfile = Object.entries(flavorProfile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  
  const sortedRegions = Object.entries(regions)
    .sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-whisky-brown">Collection Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-whisky-brown mb-1">Collection Size</h4>
              <p className="text-2xl font-bold text-whisky-gold">{bottles.length} bottles</p>
            </div>
            
            <div>
              <h4 className="font-medium text-whisky-brown mb-1">Price Range</h4>
              <p className="text-sm text-whisky-wood/70">
                Average: <span className="text-whisky-brown font-medium">${priceDistribution.average.toFixed(2)}</span>
              </p>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-whisky-wood/70">
                  Min: ${priceDistribution.min.toFixed(2)}
                </span>
                <span className="text-xs text-whisky-wood/70">
                  Max: ${priceDistribution.max.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-whisky-brown mb-1">Top Distilleries</h4>
              <ul className="space-y-1">
                {topDistilleries.map((item) => (
                  <li key={item.distillery} className="flex justify-between">
                    <span className="text-sm text-whisky-wood">{item.distillery}</span>
                    <span className="text-sm font-medium text-whisky-brown">{item.count} bottles</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-whisky-brown">Taste Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-whisky-brown mb-3">Dominant Flavors</h4>
              <div className="space-y-2">
                {sortedFlavorProfile.map(([flavor, value]) => (
                  <div key={flavor} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-whisky-wood">{flavor}</span>
                      <span className="text-whisky-brown">{value.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-whisky-amber/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-whisky-amber to-whisky-gold h-2 rounded-full"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-whisky-brown mb-1">Top Regions</h4>
              <div className="grid gap-2 grid-cols-2 mt-2">
                {sortedRegions.map(([region, count]) => (
                  <div 
                    key={region}
                    className="bg-whisky-amber/10 rounded-lg p-2 text-center"
                  >
                    <p className="text-xs text-whisky-wood/70">
                      {region}
                    </p>
                    <p className="text-lg font-medium text-whisky-brown">
                      {count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionSummary;
