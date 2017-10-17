import { TimeFrames } from "./timeFrames";

export class OfferCreate {

    label: string;
    description: string;
    reward: number;
    start_date: string;
    finish_date: string;
    timeFrames: TimeFrames[];
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
    picture_url: string;
}
