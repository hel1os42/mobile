import { Offer } from './offer';

export class Place {
    id: string;
    user_id: string;  
    name: string;
    description: string;  
    about: string;
    address: string;
    latitude: number;
    longitude: number; 
    radius: number;
    stars: number;
    is_featured: boolean;
    is_favorite: boolean;
    is_starred?: boolean;
    created_at: string;
    updated_at: string;
    alias: string;
    has_active_offers: boolean;
    testimonials_count: number;
    testimonials;
    categories_count?: number;
    offers_count: number;
    active_offers_count?: number;
    offers: Offer[];
    picture_url: string;
    cover_url: string;
    retail_types;
    category;
    tags?: string[]; 
    timezone: string;
    timezone_offset: number;
    phone: string;
    site: string;
    specialities?;
   
}


