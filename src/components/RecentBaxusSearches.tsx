
import { Badge } from "@/components/ui/badge";

interface RecentBaxusSearchesProps {
  recentSearches: string[];
  onSelect: (username: string) => void;
}

const RecentBaxusSearches = ({ recentSearches, onSelect }: RecentBaxusSearchesProps) => {
  if (!recentSearches.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-whisky-wood mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((username) => (
          <Badge
            key={username}
            className="cursor-pointer bg-whisky-amber/20 hover:bg-whisky-amber/40 text-whisky-brown"
            onClick={() => onSelect(username)}
          >
            {username}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecentBaxusSearches;
