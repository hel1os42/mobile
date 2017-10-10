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

    constructor(
        private nav: NavController,
        private navParams: NavParams) {

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.isAdvOnBoarding = this.navParams.get('isAdvOnBoarding');
        
    }

    skip() {
        //this.appMode.setOnboardingVisible();
        this.nav.setRoot(this.isAdvMode ?  this.navParams.get('page') : StartPage);
    }

}