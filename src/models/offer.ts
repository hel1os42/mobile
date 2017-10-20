import { Company } from "./company";
import { OfferCategory } from "./offerCategory";
import { OfferDate } from "./OfferDate";
import { TimeFrames } from "./timeFrames";

export class Offer {
    id: string;
    picture_url: string;
    company?: Company;
    label: string;
    description: string;
    reward: number;
    status: string;
    start_date: OfferDate;
    finish_date: OfferDate;
    country: string;
    city: string;
    category?: OfferCategory
    max_count: number;
    max_for_user: number;
    max_per_day: number;
    max_for_user_per_day: number;
    max_for_user_per_week: number;
    max_for_user_per_month: number;
    user_level_min: number;
    reserved;
    deleted_at: string;
    account_id;
    latitude: number;
    longitude: number;
    radius: number;
    category_id: string;
    categories?: OfferCategory[];
    created_at: string;
    updated_at: string;
    timeframes: TimeFrames[];
}