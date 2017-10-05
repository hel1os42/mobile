import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer4Page } from '../create-offer-4/create-offer-4';

@Component({
    selector: 'page-create-offer-3',
    templateUrl: 'create-offer-3.html'
})
export class CreateOffer3Page {

    offer: OfferCreate;
    cities: string[] = ["Los-Angeles", "Texas", "Chicago", "Kyiv", "Berlin"];
    city: string = "Los-Angeles";
;
    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');
    }

    openCreateOffer4Page() {
        this.offer.city = this.city;
        this.offer.country = "country";//to do
        this.offer.radius = 1000000;//todo
        this.offer.longitude = 50.1;//to do
        this.offer.latitude = 30.1;//to do
        this.nav.push(CreateOffer4Page, { offer: this.offer });
    }

}
