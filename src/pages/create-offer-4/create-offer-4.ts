import { ToastService } from '../../providers/toast.service';
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
    maxForUser;
    maxForUserPerDay;
    maxForUserPerWeek;
    maxForUserPerMonth;
    picture_url: string;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private toast: ToastService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');

    }

    validate() {
        let maxForUser = parseInt(this.maxForUser);
        let maxForUserPerDay = parseInt(this.maxForUserPerDay);
        if (maxForUserPerDay > 0 && maxForUser >= 0 && maxForUserPerDay > maxForUser) {
            this.toast.show('Max for user valud should be less than max overall');
            return false;
        };
        return true;
    }

    openCreateOffer5Page() {
        if (this.validate()) {
            this.offer.user_level_min = this.level;
            this.offer.max_count = 100;//to do
            this.offer.max_per_day = 20;//to do
            if(this.maxForUser) {
                this.offer.max_for_user = parseInt(this.maxForUser);
            }
            if(this.maxForUserPerDay) {
                this.offer.max_for_user_per_day = parseInt(this.maxForUserPerDay);
            }
            if(this.maxForUserPerWeek) {
                this.offer.max_for_user_per_week = parseInt(this.maxForUserPerWeek);
            }
            if(this.maxForUserPerMonth) {
                this.offer.max_for_user_per_month = parseInt(this.maxForUserPerMonth);
            }
            this.nav.push(CreateOffer5Page, { offer: this.offer, picture: this.picture_url });
        }
    }
}
