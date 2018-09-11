import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '../models/place';
import { RedeemedOffer } from '../models/redeemedOffer';
import { ApiService } from './api.service';

@Injectable()
export class OfferService {

    onRefreshRedeemedOffers: EventEmitter<RedeemedOffer[]> = new EventEmitter();
    onRefreshPlace: EventEmitter<Place> = new EventEmitter();
    onRefreshFeaturedOffers: EventEmitter<any> = new EventEmitter();

    MAX_RADIUS = 19849 * 1000;// temporary

    constructor(private api: ApiService) { }

    get(offerId, showLoading?: boolean) {
        return this.api.get(`offers/${offerId}?with=timeframes`, { showLoading: showLoading });
    }

    getFeaturedList( //featured offers
        lat: number,
        lng: number,
        // radius: number,
        page: number,
        showLoading: boolean,
    ) {
        return this.api.get('offers', {
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

    getPremiumList( //premium offers
        lat: number,
        lng: number,
        userReferralPoints: number,
        userRedemptionPoints: number,
        page: number,
        showLoading: boolean
    ) {
        let obs;
        if (!userReferralPoints && !userRedemptionPoints) {
            obs = Observable.of({
                data: [],
                last_page: 1
            })
        } else {
            let searchStr = this.getPremiumSearch(userRedemptionPoints, userReferralPoints, 1);
            let filterStr = this.getPremiumSearch(userRedemptionPoints, userReferralPoints, 0);

            obs = this.api.get('offers', {
                showLoading: showLoading,
                params: {
                    latitude: lat,
                    longitude: lng,
                    radius: this.MAX_RADIUS,
                    with: 'account.owner.place',
                    search: searchStr,
                    whereFilters: filterStr,
                    searchJoin: 'or',
                    page: page
                }
            });
        }
        return obs;
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
        let filterStr = '';
        if (tags.length > 0) {
            filterStr += this.getSearch(tag, tags);
        }
        if (types.length > 0) {
            filterStr += this.getSearch(type, types);
        }
        if (specialities.length > 0) {
            filterStr += this.getSearch(speciality, specialities);
        }
        if (search) {
            searchStr += 'description:' + `${search};` + 'name:' + `${search};`;
            // searchStr += 'name:' + `${search}`;
        }
        let str = `${'category_ids[]'}=${category_ids}&`;
        return this.api.get(`places?${str}`, {
            showLoading: showLoading,
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius,
                search: searchStr,
                whereFilters: filterStr,
                searchJoin: 'or',
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
        return obs;
    }

    getLink(endpoint: string) {
        return this.api.get(`places${endpoint}`, { showLoading: false });
    }

    getSearch(str: string, arr: string[]) {
        if (arr.length == 0) {
            str += ';';
        } else {
            for (let i = 0; i < arr.length; i++) {
                str += arr[i];
                if (i != arr.length - 1) {
                    str += '|';
                } else {
                    str += ';';
                }
            }
        }
        return str;
    }

    getPremiumSearch(redemptionPoints: number, referralPoints: number, startPoints: number) {
        let str: string
        if (redemptionPoints) {
            str = `offerData.redemption_points_price:${startPoints},${redemptionPoints}`;
        }
        if (referralPoints) {
            str = str
                ? str + `;offerData.referral_points_price:${startPoints},${referralPoints}`
                : `offerData.referral_points_price:${startPoints},${referralPoints}`
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
