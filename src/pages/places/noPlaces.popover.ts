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
    countryCode: string;
    state: string;
    radius = 19849000;
    enabledCountries = COUNTRIES;
    businessUrl = 'https://nau.io';
    retailerUrl = 'https://nau.io';
    url = 'nau.io';
    isFiltered: boolean;

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private browser: InAppBrowser) {
            
        this.isFiltered = this.navParams.get('isFiltered');
        this.isCountryEnabled = this.navParams.get('isCountryEnabled');
        this.city = this.navParams.get('city');
        this.countryCode = this.navParams.get('countryCode');
        
        // this.state = this.navParams.get('state');
    }

    loadUrl(url) {
        this.browser.create(url, '_system');
    }

    getFlag(country) {
        if (country) {
           country = country.replace(/ /g,'-');
        return `assets/img/flags/${country.toLowerCase()}.svg`; 
        }
    }

    getKey(country) {
        if (country) {
            return `COUNTRIES.${country.toUpperCase()}`;
        }
    }

    close(radius) {
        this.viewCtrl.dismiss({ radius: radius });
    }
}
