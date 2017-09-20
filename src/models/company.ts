import { OfferCategory } from "./offerCategory";
import { Offer } from "./offer";

export class Company {
    id: string;
    name: string;
    description: string;
    about: String;
    testimonials_count: number;
    testimonials;
    categories_count: number;
    categories?: OfferCategory[];
    offers_count: number;
    offers?: Offer[];
    stars: number;
    is_featured: boolean;
    is_starred: boolean;
    image_url: string;
    address: string;
    latitude: number;
    longitude: number;
    radius: number;
}