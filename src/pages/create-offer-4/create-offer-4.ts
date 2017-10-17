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
    levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    level = 1;
    maxForUser = [1, 5, 10, 20, 100, 10000000];
    maxForUs = 10000000;
    maxForUserPerDay = [1, 5, 10, 20, 100, 10000000];
    maxForUsPerDay =  10000000;
    maxForUserPerWeek = [1, 5, 10, 20, 100, 10000000];
    maxForUsPerWeek = 10000000;
    maxForUserPerMonth = [1, 5, 10, 20, 100, 10000000];
    maxForUsPerMonth = 10000000;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

    }

    openCreateOffer5Page() {
        this.offer.user_level_min = this.level;
        this.offer.max_count = 100;//to do
        this.offer.max_for_user = this.maxForUs;
        this.offer.max_for_user_per_day = this.maxForUsPerDay;
        this.offer.max_per_day = 20;//to do
        this.offer.max_for_user_per_week = this.maxForUsPerWeek;
        this.offer.max_for_user_per_month = this.maxForUsPerMonth;
        this.nav.push(CreateOffer5Page, { offer: this.offer });
    }
}
