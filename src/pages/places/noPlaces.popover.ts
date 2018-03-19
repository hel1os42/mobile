import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { COUNTRIES } from '../../const/countries';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'noPlaces-popover-component',
    templateUrl: 'noPlaces.popover.html'
})

export class NoPlacesPopover {

    isCountryEnabled: boolean;
    city: string;
    country: string;
    state: string;
    radius = 19849000;
    enabledCountries = COUNTRIES;
    businessUrl = 'nau.io';
    retailerUrl = 'nau.io';

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private browser: InAppBrowser) {

        this.isCountryEnabled = this.navParams.get('isCountryEnabled');
        this.city = this.navParams.get('city');
        this.country = this.navParams.get('country');
        // this.state = this.navParams.get('state');
    }

    loadUrl(url) {
        this.browser.create(url, '_system');
    }

    getFlag(country) {
        country = country.replace(/ /g,'-');
        return `assets/img/flags/${country.toLowerCase()}.svg`;
    }

    getKey(country) {
        return `COUNTRIES.${country.toUpperCase()}`;
    }

    close(radius) {
        this.viewCtrl.dismiss({ radius: radius});
    }
}
