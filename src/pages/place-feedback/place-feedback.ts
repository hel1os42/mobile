import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';
import { Company } from '../../models/company';

@Component({
    selector: 'page-place-feedback',
    templateUrl: 'place-feedback.html'
})
export class PlaceFeedbackPage {

    testimonial = {};

    constructor(private nav: NavController,
        private navParams: NavParams,
        private offers: OfferService) {

    }

    ionViewDidLoad() {
        this.testimonial = this.navParams.get('testimonial')
    }

    back() {
        this.nav.pop();
    }
}