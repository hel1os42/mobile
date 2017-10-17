import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { PlaceCreate } from "../models/placeCreate";
import { Company } from "../models/company";

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

    setRedeemCode(code: string) {
        return this.api.post('redemptions', { code: code });
    }

    set(place: PlaceCreate) {
        return this.api.post('places', place);
    }

}