
import { useState } from "react";
import { WhiskyBottle } from "@/types/whisky";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import TasteProfileEditor from "./TasteProfileEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WhiskyCardProps {
  bottle: WhiskyBottle;
  reason?: string;
  onUpdate?: (updatedBottle: WhiskyBottle) => void;
}

const WhiskyCard = ({ bottle, reason, onUpdate }: WhiskyCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const placeholderImage = "https://placehold.co/400x500/e9d8c2/5d4037?text=Whisky";
  
  // Format price with currency if available
  const formattedPrice = bottle.price 
    ? `$${bottle.price.toFixed(2)}` 
    : "Price not available";
  
  // Get top 3 flavor characteristics
  const topFlavors = Object.entries(bottle.flavor_profile || {})
    .filter(([_, value]) => value !== undefined)
    .sort(([_, a], [__, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([key]) => key);
  
  const handleSaveProfile = async (updatedBottle: WhiskyBottle) => {
    try {
      // Update the whisky bottle with new flavor profile
      if (onUpdate) {
        onUpdate(updatedBottle);
      }
      
      // Store the updated taste profile in localStorage for now
      // This is a fallback since we don't have a proper table in Supabase yet
      if (bottle.id && bottle.username) {
        const storageKey = `whisky_profile_${bottle.id}_${bottle.username}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedBottle.flavor_profile));
        
        toast({
          title: "Profile Updated",
          description: "Taste profile has been saved locally",
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving taste profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not save taste profile",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <TasteProfileEditor 
        bottle={bottle} 
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="whisky-card h-full flex flex-col overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={bottle.image_url || placeholderImage} 
          alt={bottle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-whisky-brown/90 to-transparent p-3">
          <h3 className="text-white font-medium text-lg leading-tight">{bottle.name}</h3>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-whisky-wood/70">{bottle.distillery}</p>
            <div className="flex gap-2 mt-1">
              {bottle.age && (
                <Badge variant="outline" className="border-whisky-amber/30 text-whisky-brown">
                  {bottle.age} Years
                </Badge>
              )}
              <Badge variant="outline" className="border-whisky-amber/30 text-whisky-brown">
                {bottle.abv}% ABV
              </Badge>
            </div>
          </div>
          <span className="font-semibold text-whisky-gold">{formattedPrice}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 flex-grow">
        <div className="flex flex-wrap gap-1 mb-3">
          {bottle.region && (
            <Badge className="bg-whisky-amber/20 hover:bg-whisky-amber/30 text-whisky-brown">
              {bottle.region}
            </Badge>
          )}
          <Badge className="bg-whisky-amber/20 hover:bg-whisky-amber/30 text-whisky-brown">
            {bottle.type}
          </Badge>
          <Badge className="bg-whisky-amber/20 hover:bg-whisky-amber/30 text-whisky-brown">
            {bottle.country}
          </Badge>
        </div>
        
        {topFlavors.length > 0 && (
          <div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-whisky-wood/70 mb-1">Top flavor notes:</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto text-whisky-amber hover:text-whisky-gold" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {topFlavors.map(flavor => (
                <span 
                  key={flavor} 
                  className="text-xs px-2 py-1 bg-whisky-amber/10 text-whisky-brown rounded-full"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {reason && (
          <div className="mt-3 pt-3 border-t border-whisky-amber/10">
            <p className="text-sm italic text-whisky-wood/70">
              "{reason}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhiskyCard;
