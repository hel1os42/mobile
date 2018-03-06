import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class FavoritesService {

    onRefreshPlaces: EventEmitter<any> = new EventEmitter();
    onRefreshOffers: EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) {
    }

    getPlaces(page: number) {
        return this.api.get(`profile/favorite/places?page=${page}`);
    }

    getOffers(page: number) {
        return this.api.get(`profile/favorite/offers?page=${page}`);
    }

    setPlace(placeId: string) {
        let obs = this.api.post('profile/favorite/places', { place_id: placeId });
        obs.subscribe(() => {
            this.onRefreshPlaces.emit({ id: placeId, isFavorite: true });
        });
        return obs;
    }
    
    setOffer(offerId: string) {
        let obs = this.api.post('profile/favorite/offers', { offer_id: offerId });
        obs.subscribe(() => this.onRefreshOffers.emit({ id: offerId, isFavorite: true }));
        return obs;
    }

    removePlace(placeId) {
        let obs = this.api.delete(`profile/favorite/places/${placeId}`);
        obs.subscribe(() => this.onRefreshPlaces.emit({ id: placeId, isFavorite: false }));
        return obs;
    }

    removeOffer(offerId) {
        let obs = this.api.delete(`profile/favorite/offers/${offerId}`);
        obs.subscribe(() => this.onRefreshOffers.emit({ id: offerId, isFavorite: false }));
        return obs;
    }
}