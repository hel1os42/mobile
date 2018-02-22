import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StartPage } from '../start/start';

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {

    isAdvMode: boolean;
    isAdvOnBoarding: boolean;
    latitude: number;
    longitude: number;

    constructor(
        private nav: NavController,
        private navParams: NavParams) {

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.isAdvOnBoarding = this.navParams.get('isAdvOnBoarding');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');

    }

    skip() {
        //this.appMode.setOnboardingVisible();
        if (this.isAdvMode) {
            this.nav.setRoot(this.navParams.get('page'), { latitude: this.latitude, longitude: this.longitude });
        }
        else {
            this.nav.setRoot(StartPage);
        }
    }
}
