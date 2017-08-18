import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable()
export class OfferService{

    constructor(private api: ApiService) {}

    getOffersData() {
        return  this.api.get('/advert/offers/create')
    }

}