import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer5Page } from '../create-offer-5/create-offer-5';

@Component({
    selector: 'page-create-offer-4',
    templateUrl: 'create-offer-4.html'
})
export class CreateOffer4Page {

    offer: OfferCreate;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

    }

    openCreateOffer5Page() {
        this.nav.push(CreateOffer5Page, { offer: this.offer });
    }
}
