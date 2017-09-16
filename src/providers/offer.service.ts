import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Offer } from "../models/offer";

@Injectable()
export class OfferService{

    constructor(private api: ApiService) {}

    getOfferData() {
        return this.api.get('advert/offers/create');
    }

    set(data: Offer) {
        this.api.post('advert/offers', data);
    }

    getCategories() {
        return this.api.get('categories');
    }

    getRedeemedOffers() {
        return this.api.get('profile?with=offers');
    }


}