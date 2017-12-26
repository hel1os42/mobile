import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import { OnBoardingPage } from '../onboarding/onboarding';

@Component({
    selector: 'settings-popover-component',
    templateUrl: 'settings.popover.html'
})

export class SettingsPopover {

    page: any;
    latitude: number;
    longitude: number;

    constructor(private viewCtrl: ViewController,
                private app: App,
                private navParams: NavParams) { 
        
        this.page = this.navParams.get('page');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');

        }

    openOnboarding() {
        this.viewCtrl.dismiss();
            // this.app.getRootNav().setRoot(OnBoardingPage, {page: this.page, isAdvMode: true, isAdvOnBoarding: true, latitude: this.latitude, longitude: this.longitude});
            this.app.getRootNav().setRoot(this.page, { latitude: this.latitude, longitude: this.longitude });
    }

    close() {
        this.viewCtrl.dismiss();
    }
}