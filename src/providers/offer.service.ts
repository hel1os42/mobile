import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { Offer } from '../models/offer';
import { CompanyService } from './company.service';
import { MockOffers } from '../mocks/mockOffers';
import { Observable } from 'rxjs';

@Injectable()
export class OfferService {

    constructor(private api: ApiService,
        private companies: CompanyService) { }

    getOfferCreate() {
        return this.api.get('advert/offers/create');
    }

    set(offer: OfferCreate) {
        this.api.post('advert/offers', offer);
    }

    getCategories() {
        return this.api.get('categories');
    }

    getRedeemedOffers() {
        return this.api.get('profile?with=offers');
    }

    getOffers() {
        //return this.api.get('offers');

        return Observable.of(MockOffers.items);
    }
}