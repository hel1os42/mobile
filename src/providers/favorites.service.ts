import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class FavoritesService {

    onRefreshPlaces: EventEmitter<any> = new EventEmitter();
    onRefreshOffers: EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) {
    }

    getPlaces(page: number, showLoading?: boolean) {
        return this.api.get(`profile/favorite/places?page=${page}`, { showLoading: showLoading });
    }

    getOffers(page: number, showLoading?: boolean) {
        return this.api.get('profile/favorite/offers', {
            showLoading: showLoading,
            params: {
                with: 'account.owner.place',
                page: page
            }
        });
    }

    setPlace(placeId: string) {
        let obs = this.api.post(
            'profile/favorite/places',
            { place_id: placeId },
            { showLoading: false }
        );
        obs.subscribe(() => {
            this.onRefreshPlaces.emit({ id: placeId, isFavorite: true });
        });
        return obs;
    }

    setOffer(offerId: string) {
        let obs = this.api.post(
            'profile/favorite/offers',
            { offer_id: offerId },
            { showLoading: false }
        );
        obs.subscribe(() => this.onRefreshOffers.emit({ id: offerId, isFavorite: true }));
        return obs;
    }

    removePlace(placeId, notRefresh?: boolean) {
        let obs = this.api.delete(`profile/favorite/places/${placeId}`);
        obs.subscribe(() => this.onRefreshPlaces.emit({
            id: placeId,
            isFavorite: false,
            notRefresh: notRefresh
        })
        );
        return obs;
    }

    removeOffer(offerId, notRefresh?: boolean) {
        let obs = this.api.delete(`profile/favorite/offers/${offerId}`);
        obs.subscribe(() => this.onRefreshOffers.emit({
            id: offerId,
            isFavorite: false,
            notRefresh: notRefresh
        })
        );
        return obs;
    }
}