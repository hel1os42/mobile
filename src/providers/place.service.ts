import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { PlaceCreate } from "../models/placeCreate";
import { Company } from "../models/company";
import { Offer } from "../models/offer";

@Injectable()
export class PlaceService {

    company: Company;

    constructor(private api: ApiService) { }

    get() {
        let obs = this.api.get('profile/place');
        obs.subscribe(company => this.company = company);
        return obs;
    }

    getWithOffers() {
        return this.api.get('profile/place?with=offers');
    }

    getWithCategory() {
        return this.api.get('profile/place?with=categories');
    }

    getOfferCreate() {
        return this.api.get('advert/offers/create');
    }

    setOffer(offer: OfferCreate) {
        return this.api.post('advert/offers', offer);
    }

    // putOffer(offer: Offer, offer_id: string) {
    //     return this.api.put(`offers/${offer_id}`, offer);
    // }to do

    setRedeemCode(code: string) {
        return this.api.post('redemptions', { code: code });
    }

    set(place: PlaceCreate) {
        let obs = this.api.post('places', place);
        obs.subscribe(company => this.company = company);
        return obs;
    }

    getOffers() {
        return this.api.get('advert/offers');
    }

    getFilteredOffersByDate(startDate, finishDate) {
        return this.api.get(`advert/offers?search=status:active;start_date:${startDate};finish_date:${finishDate}&searchJoin=and`);
    }

    getOffersWithTimeframes() {
        return this.api.get('advert/offers?with=timeframes');
    }
    
    getActiveOffers() {
        return this.api.get('advert/offers?search=status:active');
    }

    getDeActiveOffers() {
        return this.api.get('advert/offers?search=status:deactive');
    }

    getOffer(offer_id: string) {
        return this.api.get(`advert/offers/${offer_id}?with=timeframes`);
    }

}