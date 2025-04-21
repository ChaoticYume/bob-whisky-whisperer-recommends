
import { WhiskyBottle } from "../types/whisky";

export const parseCSV = (csvContent: string): WhiskyBottle[] => {
  const lines = csvContent.split('\n');
  
  // Extract headers
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Skip the header row
  const bottles: WhiskyBottle[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(value => value.trim());
    const bottle: Partial<WhiskyBottle> = {
      id: values[headers.indexOf('id')] || `bottle-${i}`,
      name: values[headers.indexOf('name')] || '',
      distillery: values[headers.indexOf('brand_id')] || '', // Map brand_id to distillery
      region: values[headers.indexOf('region')],
      country: values[headers.indexOf('country')] || 'Unknown',
      type: values[headers.indexOf('spirit_type')] || 'Unknown',
      flavor_profile: {}
    };
    
    // Parse number values
    const ageIndex = headers.indexOf('age');
    if (ageIndex !== -1 && values[ageIndex]) {
      bottle.age = parseInt(values[ageIndex], 10) || undefined;
    }
    
    const abvIndex = headers.indexOf('abv');
    if (abvIndex !== -1 && values[abvIndex]) {
      bottle.abv = parseFloat(values[abvIndex]) || 0;
    }
    
    // Parse price - check multiple price fields
    const msrpIndex = headers.indexOf('avg_msrp');
    const fairPriceIndex = headers.indexOf('fair_price');
    const shelfPriceIndex = headers.indexOf('shelf_price');
    const priceIndex = headers.indexOf('price');
    
    // Try to get price from any available source in order of preference
    if (msrpIndex !== -1 && values[msrpIndex]) {
      bottle.price = parseFloat(values[msrpIndex]) || undefined;
    } else if (fairPriceIndex !== -1 && values[fairPriceIndex]) {
      bottle.price = parseFloat(values[fairPriceIndex]) || undefined;
    } else if (shelfPriceIndex !== -1 && values[shelfPriceIndex]) {
      bottle.price = parseFloat(values[shelfPriceIndex]) || undefined;
    } else if (priceIndex !== -1 && values[priceIndex]) {
      bottle.price = parseFloat(values[priceIndex]) || undefined;
    }
    
    // Parse image URL
    const imageIndex = headers.indexOf('image_url');
    if (imageIndex !== -1 && values[imageIndex]) {
      bottle.image_url = values[imageIndex];
    }
    
    // Parse flavor profile
    const flavorAttributes = [
      'smoky', 'peaty', 'spicy', 'herbal', 'oily', 
      'body', 'rich', 'sweet', 'salty', 'vanilla', 'fruity', 'floral'
    ];
    
    flavorAttributes.forEach(flavor => {
      const index = headers.indexOf(flavor);
      if (index !== -1 && values[index]) {
        bottle.flavor_profile![flavor as keyof WhiskyBottle["flavor_profile"]] = 
          parseFloat(values[index]) || undefined;
      }
    });
    
    bottles.push(bottle as WhiskyBottle);
  }
  
  return bottles;
};

export const generateSampleCSV = (): string => {
  const headers = [
    'id', 'name', 'distillery', 'region', 'country', 'spirit_type', 
    'age', 'abv', 'avg_msrp', 'smoky', 'peaty', 'spicy', 'herbal', 
    'oily', 'body', 'rich', 'sweet', 'salty', 'vanilla', 'fruity', 'floral'
  ].join(',');
  
  const sampleRows = [
    'W001,Glenfiddich 12,Glenfiddich,Speyside,Scotland,Single Malt,12,40,55,1,0,3,2,3,5,4,6,1,5,6,3',
    'W002,Lagavulin 16,Lagavulin,Islay,Scotland,Single Malt,16,43,89,8,8,4,3,6,7,7,4,5,3,2,1',
    'W003,Maker\'s Mark,Maker\'s Mark,Kentucky,USA,Bourbon,,45,35,2,0,5,1,4,5,6,7,0,6,4,2',
    'W004,Redbreast 12,Midleton,Ireland,Irish Single Pot Still,12,40,65,1,0,4,4,3,5,6,6,1,5,6,4',
    'W005,Balvenie DoubleWood 12,Balvenie,Speyside,Scotland,Single Malt,12,40,65,1,0,3,2,3,5,6,6,1,7,5,4'
  ].join('\n');
  
  return `${headers}\n${sampleRows}`;
};
