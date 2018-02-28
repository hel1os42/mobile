import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-place-feedback',
    templateUrl: 'place-feedback.html'
})
export class PlaceFeedbackPage {

    testimonial = {};

    constructor(private nav: NavController,
        private navParams: NavParams) {

    }

    ionViewDidLoad() {
        this.testimonial = this.navParams.get('testimonial')
    }

    back() {
        this.nav.pop();
    }
}
