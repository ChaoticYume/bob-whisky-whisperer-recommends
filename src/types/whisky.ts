
export interface WhiskyBottle {
  id: string;
  name: string;
  distillery: string;
  region?: string;
  country: string;
  type: string;
  age?: number;
  abv: number;
  price?: number;
  flavor_profile: {
    smoky?: number;
    peaty?: number;
    spicy?: number;
    herbal?: number;
    oily?: number;
    body?: number;
    rich?: number;
    sweet?: number;
    salty?: number;
    vanilla?: number;
    fruity?: number;
    floral?: number;
  };
  image_url?: string;
  username?: string; // Added this property to track which user added/imported this bottle
}

export interface UserCollection {
  username: string;
  bottles: WhiskyBottle[];
  wishlist: WhiskyBottle[];
}
