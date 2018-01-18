import { Offer } from './offer';
import { OfferCategory } from './offerCategory';
import { PlaceCreate } from './placeCreate';

export class Place extends PlaceCreate  {
    id: string;
    user_id: string;
    testimonials_count: number;
    testimonials;
    categories_count?: number;
    categories?: OfferCategory[];
    offers_count: number;
    active_offers_count?: number;
    offers?: Offer[];
    stars: number;
    is_featured: boolean;
    is_starred: boolean;
    picture_url: string;
    cover_url: string;
}


