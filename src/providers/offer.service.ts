import { EventEmitter, Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Place } from '../models/place';
import { RedeemedOffer } from '../models/redeemedOffer';
import { AdjustService } from './adjust.service';
import { AnalyticsService } from './analytics.service';
import { ApiService } from './api.service';
import { AppModeService } from './appMode.service';
import { Observable } from 'rxjs';
import { MockOffers } from '../mocks/mockOffers';

// import { MockCompanies } from '../mocks/mockCompanies';

@Injectable()
export class OfferService {

    onRefreshRedeemedOffers: EventEmitter<RedeemedOffer[]> = new EventEmitter();
    onRefreshPlace: EventEmitter<Place> = new EventEmitter();
    onRefreshFeaturedOffers: EventEmitter<any> = new EventEmitter();

    MAX_RADIUS = 19849 * 1000;// temporary

    constructor(
        private api: ApiService,
        private gAnalytics: GoogleAnalytics,
        private analytics: AnalyticsService,
        private adjust: AdjustService,
        private appMode: AppModeService) { }

    get(offerId, showLoading?: boolean) {
        return this.api.get(`offers/${offerId}?with=timeframes`, { showLoading: showLoading });
    }

    getFeaturedList( // for featured offers
        lat: number,
        lng: number,
        // radius: number,
        page: number,
        showLoading: boolean
    ) {
        // return this.api.get(`offers`, {
        return this.api.get('offers', {
            // return this.api.get(`offers?category_ids[]=382b8e95-9083-4095-a928-ee9178ee6275`, {// prod mock
            showLoading: showLoading,
            params: {
                featured: true,
                latitude: lat,
                longitude: lng,
                radius: this.MAX_RADIUS,
                with: 'account.owner.place',
                page: page
            }
        });
    }

    getPremiumList(
        lat: number,
        lng: number,
        // radius: number,
        page: number,
        showLoading: boolean
    ) {
        return Observable.of(MockOffers.items).delay(1000); //temporary

    }

    getPlacesOfRoot(
        category_ids: string,
        lat: number,
        lng: number,
        radius: number,
        page: number,
        showLoading: boolean) {

        let str = `${'category_ids[]'}=${category_ids}&`;
        return this.api.get(`places?${str}`, {
            showLoading: showLoading,
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius,
                with: 'category;retailTypes;tags;specialities',
                page: page
            }
        });
    }

    getPlaces(
        category_ids: string,
        tags: string[],
        types: string[],
        specialities: string[],
        lat: number,
        lng: number,
        radius: number,
        search: string,
        page: number,
        showLoading: boolean) {

        let tag = 'tags.slug:';
        let type = 'retailTypes.id:';
        let speciality = 'specialities.slug:';
        let searchStr = '';
        if (tags.length > 0) {
            searchStr += this.getSearch(tag, tags);
        }
        if (types.length > 0) {
            searchStr += this.getSearch(type, types);
        }
        if (specialities.length > 0) {
            searchStr += this.getSearch(speciality, specialities);
        }
        if (search && search !== '') {
            // searchStr += 'description:' + `${search};` + 'name:' + `${search};`;
            searchStr += 'name:' + `${search}`;
        }
        let str = `${'category_ids[]'}=${category_ids}&`;
        return this.api.get(`places?${str}`, {
            showLoading: showLoading,
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius,
                search: searchStr,
                searchJoin: 'and',
                with: 'category;retailTypes;tags;specialities',
                page: page
            }
        });
    }

    getPlace(place_id: string, noLoading?: boolean) {
        return this.api.get(`places/${place_id}?with=offers;specialities`, { showLoading: !noLoading });
    }

    getPlaceOffers(place_id) {
        return this.api.get(`places/${place_id}/offers`);
    }

    getCategories(showLoading?: boolean) {
        return this.api.get('categories', { showLoading: showLoading });
    }

    getCategory(category_id) {
        return this.api.get(`categories/${category_id}`);
    }

    getSubCategories(category_id) {
        return this.api.get(`categories/${category_id}?with=children`);
    }

    getTypes(category_id: string) {
        return this.api.get(`categories/${category_id}`, {
            params: {
                with: 'retailTypes;retailTypes.specialities;tags'
            }
        });
        // return Observable.of(MockCategory.items);
    }

    getRedeemedOffers() {
        return this.api.get('profile?with=offers');
    }

    getActivationCode(offer_id: string) {
        return this.api.get(`offers/${offer_id}/activation_code`);
    }

    getRedemptionStatus(code: string) {
        let obs = this.api.get(`activation_codes/${code}`, {
            showLoading: false,
            ignoreHttpNotFound: true
        });
        // obs.subscribe(status => {
        //     if (status.redemption_id) {
        //         this.refreshRedeemedOffers();
        //         this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'event_redeemoffer', status.redemption_id);
        //         this.analytics.faLogEvent('event_redeemoffer');
        //         this.adjust.setEvent('ACTION_REDEMPTION');
        //     }
        // }, err => {})
        return obs;
    }

    getLink(endpoint: string) {
        return this.api.get(`places${endpoint}`, { showLoading: false });
    }

    getSearch(str: string, arr: string[]) {
        if (arr.length == 0) {
            str += ';';
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                str += arr[i];
                if (i != arr.length - 1) {
                    str += '|';
                }
                else {
                    str += ';';
                }
            }
        }
        return str;
    }

    refreshRedeemedOffers() {
        this.getRedeemedOffers()
            .subscribe(resp => {
                this.onRefreshRedeemedOffers.emit(resp);
            })
    }

    refreshFeaturedOffers(lat, lng) {
        this.getFeaturedList(lat, lng, 1, false)
            .subscribe(resp => {
                this.onRefreshFeaturedOffers.emit(resp);
            })
    }

    refreshPlace(placeId) {
        this.getPlace(placeId, true)
            .subscribe(resp => {
                this.onRefreshPlace.emit(resp);
            })
    }
}
