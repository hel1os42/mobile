import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { AppModeService } from '../../providers/appMode.service';
import { StartPage } from "../start/start";
import { SplashScreenPage } from "../splash-screen/splash-screen";
import { TabsPage } from "../tabs/tabs";


@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
    code: string;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService) {
    }

    skip() {
        //this.appMode.setOnboardingVisible();
        this.nav.push(StartPage);
    }

}