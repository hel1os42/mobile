import { Company } from "./company";
import { OfferCategory } from "./offerCategory";

export class Offer {
    company: Company
    image_url;
    label: string;
    description: string;
    reward: number;
    start_date;
    finish_date;
    start_time;
    finish_time;
    country;
    city;
    category: OfferCategory
    max_count: number;
    max_for_user: number;
    max_per_day: number;
    max_for_user_per_day: number;
    user_level_min: number;
    latitude: number;
    longitude: number;
    radius: number;
    categories_count: number;
    categories;
}