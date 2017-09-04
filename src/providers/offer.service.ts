import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Offer } from "../models/offer";

@Injectable()
export class OfferService{

    constructor(private api: ApiService) {}

    getOffersData() {
        return this.api.get('/advert/offers/create');
    }

    setOffer(date: Offer) {
        this.api.post('advert/offers', date);
    }

    getOffersCategories() {
        return this.api.get('categories');
    }

}