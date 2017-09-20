import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { Offer } from '../models/offer';
import { MockOffers } from '../mocks/mockOffers';
import { Observable } from 'rxjs';
import { MockCompanies } from '../mocks/mockCompanies';

@Injectable()
export class OfferService {

    constructor(
        private api: ApiService) { }

    getCompanies() {
        // return this.api.get('companies');
        return Observable.of(MockCompanies.items);
    }

    getCompany(id) {
        //return this.api.get(`company/${id}?with=offers`);
        let companies = MockCompanies.items.filter(p => p.id == id);
        if (companies.length == 0)
            throw new Error('Invalid compamy ID');
        let company = companies[0];
        company.offers = MockOffers.items;
        company.offers_count = MockOffers.length;
        return Observable.of(company);
    }

    getOffers() {
        //return this.api.get('offers');
        return Observable.of(MockOffers.items);
    }

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
}