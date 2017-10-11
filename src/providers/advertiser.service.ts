import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { PlaceCreate } from "../models/placeCreate";

@Injectable()
export class AdvertiserService {

    constructor(private api: ApiService) { }

    get() {
        return this.api.get('profile/place');
    }

    getOfferCreate() {
        return this.api.get('advert/offers/create');
    }

    setOffer(offer: OfferCreate) {
        return this.api.post('advert/offers', offer);
    }

    setRedeemCode(code: string) {
        return this.api.post('redemptions', { code: code });
    }

    set(place: PlaceCreate) {
        return this.api.post('places', {place: place});
    }

    setPicture(picture) {
        return this.api.post('profile/place/picture', {picture: picture});
    }

    setCover(cover) {
        return this.api.post('profile/place/cover', {cover: cover});
    }


}