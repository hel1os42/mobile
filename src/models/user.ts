export class User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    invite_code: string;
    phone: string;
    latitude: number;
    longitude: number;
    picture_url: string;
    level: number;
    points: number;
    offers_count: number;
    referrals_count: number;
    accounts_count: number;
    activation_codes_count: number
    accounts?: any;
    roles?: any[];
    approved: boolean;
    referral_points?: number;
    redemption_points?: number;
}
/*missing:  
    facebookName: string;
    twitterName: string;
    instagramName: string;
    gender:string;
    age: number;
    income;*/
