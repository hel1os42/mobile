import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from "./api.service";
import { MockCategory } from '../mocks/mockCategory';
// import { MockCompanies } from '../mocks/mockCompanies';

@Injectable()
export class OfferService {

    constructor(
        private api: ApiService) { }

    // getCompanies(categoryId?) {
    //     // return this.api.get('companies', false, {
    //     //     with: 'categories',
    //     //     category_id: categoryId
    //     // });
    //     return Observable.of(MockCompanies.items);
    // }

    // getCompany(id) {
    //     //return this.api.get(`company/${id}?with=offers`);
    //     let companies = MockCompanies.items.filter(p => p.id == id);
    //     if (companies.length == 0)
    //         throw new Error('Invalid compamy ID');
    //     let company = companies[0];
    //     company.offers = MockOffers.items;
    //     company.offers_count = MockOffers.items.length;
    //     return Observable.of(company);
    // }

    // getOffers(category_ids: string[]) {
    //     //return this.api.get(`offers?category_ids[0]=${category_ids[0]}`);
    //     return Observable.of(MockOffers.items);
    // }

    getPlaces(category_ids: string[], lat: number, lng: number, radius: number, search: string, page: number) {
        let str = '';
        for (let i = 0; i < category_ids.length; i++) {
            let id = category_ids[i];
            str += `${'category_ids[]'}=${id}&`;
        };

        return this.api.get(`places?${str}`, {
            showLoading: page == 1,
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius,
                with: 'category;retailTypes;specialities;tags',
                search: search,
                page: page
            }
        });
    }

    getPlace(place_id: string) {
        return this.api.get(`places/${place_id}?with=offers`);
    }

    getPlaceOffers(place_id) {
        return this.api.get(`places/${place_id}/offers`);
    }

    getCategories() {
        return this.api.get('categories');
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
}