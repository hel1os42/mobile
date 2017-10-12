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
    levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    level: number = 1;
    maxForUser: number[] = [1, 5, 10, 20, 100, 10000000];
    maxForUs: number = 10000000;
    maxForUserPerDay: number[] = [1, 5, 10, 20, 100, 10000000];
    maxForUsPerDay: number =  10000000;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

    }

    openCreateOffer5Page() {
        this.offer.user_level_min = this.level;
        this.offer.max_count = 10;//to do
        this.offer.max_for_user = this.maxForUs;
        this.offer.max_for_user_per_day = this.maxForUsPerDay;
        this.offer.max_per_day = 100;//to do
        this.nav.push(CreateOffer5Page, { offer: this.offer });
    }
}
