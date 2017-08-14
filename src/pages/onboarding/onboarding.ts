import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { StorageService } from "../../providers/storage.service";

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
    code: string;
    SHOWN_KEY = 'shown';

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private storage: StorageService) {
    }
    
skip() {
    this.storage.set(this.SHOWN_KEY, true);
    this.nav.push(StartPage);
}

}