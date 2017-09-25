export class RedeemedOffer {
    id: string;
    reward: number;
    picture_url: string;
    status: string;
    country: string;
    city: string;
    max_count: number;
    max_for_user: number;
    max_per_day: number;
    max_for_user_per_day: number;
    radius: number;
    created_at: string;
    updated_at: string;
    account_id: number;
    label: string;
    description: string;
    start_date: string;
    finish_date: string;
    start_time: string;
    finish_time: string;
    category_id: string;
    user_level_min: number;
    latitude: string;
    longitude: string;
    pivot: {
        user_id: string;
        offer_id: string;
        created_at: string;
        points: number;
    }
}