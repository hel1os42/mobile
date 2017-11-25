import { OfferCategory } from "./offerCategory";
import { Offer } from "./offer";

export class Company {
    id: string;
    user_id: string;
    name: string;
    description: string;
    about: String;
    testimonials_count: number;
    testimonials;
    categories_count: number;
    categories?: OfferCategory[];
    offers_count: number;
    active_offers_count?: number;
    offers?: Offer[];
    stars: number;
    is_featured: boolean;
    is_starred: boolean;
    address: string;
    latitude: number;
    longitude: number;
    radius: number;    
    picture_url: string;
    cover_url: string;
}


