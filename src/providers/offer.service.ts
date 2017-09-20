import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { Offer } from '../models/offer';
import { CompanyService } from './company.service';

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

    getOffersList() {
        //return this.api.get('offers');

        let offer1, offer2, offer3;//temporary
        let offers: Offer[] = [offer1, offer2, offer3];
        let companies = this.companies.getCompanies();

        offer1 = {
            company: companies[0],
            image_url: "",
            label: "Chance for you",
            description: "A hamburger or burger is a sandwich consisting of one",
            reward: 1,
            start_date: "2017-09-15 16:38:17.000000+0200",
            finish_date: "2017-11-15 16:38:17.000000+0200",
            start_time: "16:38:17.000000+0200",
            finish_time: "16:38:17.000000+0200",
            country: "Ukraine",
            city: "Kiyv",
            category: "Food & Drink",
            max_count: 1,
            max_for_user: 1,
            max_per_day: 1,
            max_for_user_per_day: 1,
            user_level_min: 1,
            latitude: 50.466430,
            longitude: 30.669317,
            radius: 50000,
            categories_count: 1,
            categories: null
        }
        offer2 = {
            company: companies[0],
            image_url: "",
            label: "Happy Friday",
            description: "The patty may be pan fried, barbecued, or flame broiled",
            reward: 1,
            start_date: "2017-09-15 16:38:17.000000+0200",
            finish_date: "2017-11-15 16:38:17.000000+0200",
            start_time: "16:38:17.000000+0200",
            finish_time: "16:38:17.000000+0200",
            country: "Ukraine",
            city: "Kiyv",
            category: "Food & Drink",
            max_count: 1,
            max_for_user: 1,
            max_per_day: 1,
            max_for_user_per_day: 1,
            user_level_min: 1,
            latitude: 50.466430,
            longitude: 30.669317,
            radius: 50000,
            categories_count: 1,
            categories: null
        }
        offer3 = {
            company: companies[0],
            image_url: "",
            label: "Happy Burger",
            description: "A hamburger or burger is a sandwich consisting of one",
            reward: 1,
            start_date: "2017-09-15 16:38:17.000000+0200",
            finish_date: "2017-11-15 16:38:17.000000+0200",
            start_time: "16:38:17.000000+0200",
            finish_time: "16:38:17.000000+0200",
            country: "Ukraine",
            city: "Kiyv",
            category: null,
            max_count: 1,
            max_for_user: 1,
            max_per_day: 1,
            max_for_user_per_day: 1,
            user_level_min: 1,
            latitude: 50.466430,
            longitude: 30.669317,
            radius: 50000,
            categories_count: 1,
            categories: null,
        }
        return offers;
    }
   




}