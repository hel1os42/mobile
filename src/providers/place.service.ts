import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { PlaceCreate } from "../models/placeCreate";
import { Company } from "../models/company";
import { Offer } from "../models/offer";

@Injectable()
export class PlaceService {

    company: Company;
    onRefreshCompany: EventEmitter<Company> = new EventEmitter<Company>();

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

    putOffer(offer: Offer, offer_id: string) {
        return this.api.put(`advert/offers/${offer_id}`, offer);
    }

    changeOfferStatus(statusInfo, offer_id: string) {
        return this.api.put(`advert/offers/${offer_id}/status`, statusInfo);
    }

    setRedeemCode(code: string) {
        return this.api.post('redemptions', { code: code });

    }

    set(place: PlaceCreate) {
        let obs = this.api.post('places', place);
        obs.subscribe(company => this.company = company);
        return obs;
    }

    getOffers(page) {
        return this.api.get(`advert/offers?page=${page}`, page == 1);
    }

    getFilteredOffersByDate(startDate, finishDate, page) {
        return this.api.get(`advert/offers?search=status:active;start_date:${startDate};finish_date:${finishDate}&searchJoin=and&page=${page}`, page == 1);
    }

    getOffersWithTimeframes() {
        return this.api.get('advert/offers?with=timeframes');
    }

    getActiveOffers(page) {
        return this.api.get(`advert/offers?search=status:active&page=${page}`, page == 1);
    }

    getDeActiveOffers(page) {
        return this.api.get(`advert/offers?search=status:deactive&page=${page}`, page == 1);
    }

    getOffer(offer_id: string, loading: boolean) {
        return this.api.get(`advert/offers/${offer_id}`, loading);
    }

    getOfferWithTimeframes(offer_id: string) {
        return this.api.get(`advert/offers/${offer_id}?with=timeframes`);
    }

    refreshPlace() {
        this.get().subscribe(company => this.onRefreshCompany.emit(company));
    }

}