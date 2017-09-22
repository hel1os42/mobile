import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppModeService } from '../../providers/appMode.service';
import { StartPage } from '../start/start';

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
    code: string;
    

    constructor(
        private nav: NavController,
        private appMode: AppModeService) {
    }

    skip() {
        //this.appMode.setOnboardingVisible();
        this.nav.setRoot(StartPage);
    }

}