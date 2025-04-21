
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { WhiskyBottle } from "@/types/whisky";

interface TasteProfileEditorProps {
  bottle: WhiskyBottle;
  onSave: (updatedBottle: WhiskyBottle) => void;
  onCancel: () => void;
}

const flavorAttributes = [
  "smoky", "peaty", "spicy", "herbal", "oily", 
  "body", "rich", "sweet", "salty", "vanilla", 
  "fruity", "floral"
];

export default function TasteProfileEditor({ 
  bottle, 
  onSave, 
  onCancel 
}: TasteProfileEditorProps) {
  const [editedProfile, setEditedProfile] = useState<Record<string, number>>(
    {...(bottle.flavor_profile || {})}
  );

  const handleFlavorChange = (flavor: string, value: number[]) => {
    setEditedProfile(prev => ({
      ...prev,
      [flavor]: value[0]
    }));
  };

  const handleSave = () => {
    const updatedBottle = {
      ...bottle,
      flavor_profile: editedProfile
    };
    onSave(updatedBottle);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-whisky-brown mb-4">Edit Taste Profile</h3>
      <p className="text-sm text-whisky-wood/70 mb-6">
        Move the sliders to adjust the intensity of each flavor note (0-10)
      </p>
      
      <div className="space-y-4">
        {flavorAttributes.map(flavor => (
          <div key={flavor} className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium capitalize text-whisky-wood">
                {flavor}
              </label>
              <span className="text-sm text-whisky-amber font-medium">
                {editedProfile[flavor] !== undefined ? editedProfile[flavor] : 0}
              </span>
            </div>
            <Slider
              value={[editedProfile[flavor] !== undefined ? editedProfile[flavor] : 0]}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => handleFlavorChange(flavor, value)}
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-whisky-amber/30 text-whisky-brown"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-whisky-amber hover:bg-whisky-gold text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
