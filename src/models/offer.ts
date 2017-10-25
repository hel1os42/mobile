import { Company } from "./company";
import { OfferCategory } from "./offerCategory";
import { OfferDate } from "./OfferDate";
import { TimeFrames } from "./timeFrames";
import { OfferCreate } from "./offerCreate";

export class Offer extends OfferCreate {
    id: string;
    picture_url: string;
    company?: Company;
    status: string;
    category?: OfferCategory
    deleted_at: string;
    account_id: string;
    categories?: OfferCategory[];
    created_at: string;
    updated_at: string;
    timeframes: TimeFrames[];
}