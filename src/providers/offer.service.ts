import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Offer } from "../models/offer";

@Injectable()
export class OfferService{

    constructor(private api: ApiService) {}

    getOfferCreate() {
        return this.api.get('advert/offers/create');
    }

    set(offer: Offer) {
        this.api.post('advert/offers', offer);
    }

    getCategories() {
        return this.api.get('categories');
    }

    getRedeemedOffers() {
        return this.api.get('profile?with=offers');
    }


}