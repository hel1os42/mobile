import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { PlaceCreate } from "../models/placeCreate";
import { Place } from "../models/place";
import { Offer } from "../models/offer";
import { Observable } from 'rxjs/Observable';
import { MockGetPlace } from '../mocks/mockGetPlace';


@Injectable()
export class PlaceService {

    company: Place;
    onRefreshCompany: EventEmitter<Place> = new EventEmitter<Place>();
    onRefreshOffersList:EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) { }

    get(ignoreNotFound?: boolean) {
        let obs = this.api.get('profile/place', { ignoreHttpNotFound: ignoreNotFound });
        obs.subscribe(company => this.company = company);
        return obs;
    }

    getWithOffers() {
        return this.api.get('profile/place?with=offers');
    }

    getWithCategory() {
        return this.api.get('profile/place', {
            params: {
                with: 'category;retailTypes;specialities;tags'
            }
        });
        // return Observable.of(MockGetPlace.place);
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

    deleteOffer(offer_id: string) {
        return this.api.delete(`advert/offers/${offer_id}`);
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

    putPlace(place: Place) {
        return this.api.put('profile/place', place);
    }

    patchPlace(data) {
        return this.api.patch('profile/place', data);
    }

    getOffers(page) {
        return this.api.get(`advert/offers?page=${page}`, {
            showLoading: page == 1
        });
    }

    // getFilteredOffersByDate(startDate, finishDate, page) {
    //     return this.api.get(`advert/offers?search=status:active;start_date:${startDate};finish_date:${finishDate}&searchJoin=and&page=${page}`, {
    //         showLoading: page == 1
    //     });
    // }

    getFilteredOffersByDate(startDate, finishDate, page) {
        return this.api.get('advert/offers', {
            showLoading: page == 1,
            params: {
                search: `status:active;start_date:${startDate};finish_date:${finishDate}`,
                searchJoin: 'and',
                page: page
            }
        });
    }

    getOffersWithTimeframes() {
        return this.api.get('advert/offers?with=timeframes');
    }

    getActiveOffers(page) {
        return this.api.get('advert/offers', {
            showLoading: page == 1,
            params: {
                search: 'status:active',
                page: page
            }
        });
    }

   getDeActiveOffers(page) {
        return this.api.get('advert/offers', {
            showLoading: page == 1,
            params: {
                search: 'status:deactive',
                page: page
            }
        });
    }

    getOffer(offer_id: string) {
        return this.api.get(`advert/offers/${offer_id}`, {
            showLoading: false,
            ignoreHttpNotFound: true
        });
    }

    getOfferWithTimeframes(offer_id: string) {
        return this.api.get(`advert/offers/${offer_id}?with=timeframes`);
    }

    refreshPlace() {
        this.get().subscribe(company => this.onRefreshCompany.emit(company));
    }

    refreshOffersList() {
        this.getOffers(1).subscribe(list => this.onRefreshOffersList.emit(list));
    }

}