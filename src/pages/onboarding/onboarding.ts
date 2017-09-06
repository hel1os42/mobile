import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { StorageService } from "../../providers/storage.service";
import { SplashScreenPage } from "../splash-screen/splash-screen";
import { TabsPage } from "../tabs/tabs";

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
    code: string;
    SHOWN_KEY = 'shownOnboarding';

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private storage: StorageService) {
    }
    
skip() {
    this.storage.set(this.SHOWN_KEY, true);
    this.nav.push(TabsPage);
}

}