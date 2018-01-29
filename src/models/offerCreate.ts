import { TimeFrames } from "./timeFrames";

export class OfferCreate {

    label: string;
    description: string;
    reward: number;
    reserved: number;
    start_date: any;
    finish_date: any;
    timeframes: TimeFrames[];
    category_id: string;
    max_count: number;
    max_for_user: number;
    max_per_day: number;
    max_for_user_per_day: number;
    max_for_user_per_week: number;
    max_for_user_per_month: number;
    user_level_min: number;
    latitude: number;
    longitude: number;
    radius: number;
    country: string;
    city: string;
    delivery?: boolean;
    gift_bonus_descr?: string;
    discount_percent?: number;
    discount_start_price?: number;
    discount_finish_price?: number;
    currency: string;

}
