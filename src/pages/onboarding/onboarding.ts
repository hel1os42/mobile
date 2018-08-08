import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NetworkService } from '../../providers/network.service';
import { GoogleAnalyticsService } from '../../providers/googleAnalytics.service';

@Component({
    selector: 'page-onboarding',
    templateUrl: 'onboarding.html'
})
export class OnBoardingPage {

    isAdvMode: boolean;
    isAdvOnBoarding: boolean;
    latitude: number;
    longitude: number;
    isConnected: boolean;
    slideIndex = 0;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private statusBar: StatusBar,
        private network: NetworkService,
        private gAnalytics: GoogleAnalyticsService) {

        this.isConnected = this.network.getStatus();

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.isAdvOnBoarding = this.navParams.get('isAdvOnBoarding');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');

    }

    skip() {
        //this.appMode.setOnboardingVisible();
        if (this.isConnected) {

            if (this.isAdvMode) {
                this.nav.setRoot(this.navParams.get('page'), { latitude: this.latitude, longitude: this.longitude });
            } else {
                this.nav.setRoot(LoginPage);
            }
        }

    }

    slideChangeHandler(event) {
        if (this.slideIndex != event.realIndex) {
            const pageName = 'OnBoardingPage';
            let str = event.realIndex !== 0 
            ? '_' + event.realIndex 
            : '';
            
            let key = pageName + str;
            this.gAnalytics.trackView(key);
        }
        this.slideIndex = event.realIndex;
    }

    lastChangeHandler(event) {
        if (event.realIndex == 2 && this.slideIndex == 2) {
            this.skip();
        }
    }

    ionViewDidLoad() {
        this.statusBar.styleLightContent();
    }

    ngOnDestroy() {
        this.statusBar.styleDefault();
    }
}
