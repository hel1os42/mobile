import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

// import { MockCompanies } from '../mocks/mockCompanies';

@Injectable()
export class OfferService {

    constructor(
        private api: ApiService) { }

    getPlacesOfRoot(category_ids: string, lat: number, lng: number, radius: number, page: number) {
        let str = `${'category_ids[]'}=${category_ids}&`;
        return this.api.get(`places?${str}`, {
            showLoading: page == 1,
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius,
                with: 'category;retailTypes;tags;specialities',
                page: page
            }
        });
    }

    getPlaces(category_ids: string, tags: string[], types: string[], specialities: string[], lat: number, lng: number, radius: number, search: string, page: number) {
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
            searchStr += 'description:' + `${search};` + 'name:' + `${search};`;
        }
        let str = `${'category_ids[]'}=${category_ids}&`;
        return this.api.get(`places?${str}`, {
            showLoading: page == 1,
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

    getPlace(place_id: string, isShare?: boolean) {
        let params = isShare 
        ? `places/${place_id}?with=offers;specialities` 
        : `places/${place_id}?with=offers`;
        return this.api.get(params);
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

    getRedemtionStatus(code: string) {
        return this.api.get(`activation_codes/${code}`, { showLoading: false });
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
}