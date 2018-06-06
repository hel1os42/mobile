import { OfferCreate } from './offerCreate';
import { Place } from './place';
import { TimeFrames } from './timeFrames';

export class Offer extends OfferCreate {
    id: string;
    picture_url: string;
    company?: Place;
    status: string;
    deleted_at: string;
    account_id: string;
    created_at: string;
    updated_at: string;
    timeframes: TimeFrames[];
    redemptions_count: number;
    type: string;
    is_favorite?: boolean;
    rich_description?: string;
    timeframes_offset: number;
    points: number;
    redemption_access_code: number;
    referral_points_price: number;
    redemption_points_price: number;
    is_featured?: boolean;
    owner?: any;
}