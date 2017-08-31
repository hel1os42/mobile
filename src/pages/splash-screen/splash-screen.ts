import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";

@Component({
    selector: 'page-splash-screen',
    templateUrl: 'splash-screen.html'
})
export class SplashScreenPage {

    constructor(private nav: NavController) {
    }

    openSettings() {
        this.nav.push(SettingsPage);
    }
}