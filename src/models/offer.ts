import { Company } from "./company";
import { OfferCategory } from "./offerCategory";

export class Offer {
    id: string;
    picture_url: string;
    company?: Company;
    label: string;
    description: string;
    reward: number;
    start_date: string;
    finish_date: string;
    start_time: string;
    finish_time: string;
    country: string;
    city: string;
    category?: OfferCategory
    max_count: number;
    max_for_user: number;
    max_per_day: number;
    max_for_user_per_day: number;
    user_level_min: number;
    latitude: number;
    longitude: number;
    radius: number;
    categories_count: number;
    categories?: OfferCategory[];
}