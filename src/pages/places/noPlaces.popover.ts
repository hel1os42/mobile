import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { COUNTRIES } from '../../const/countries';

@Component({
    selector: 'noPlaces-popover-component',
    templateUrl: 'noPlaces.popover.html'
})

export class NoPlacesPopover {

    isCountryEnabled: boolean;
    city: string;
    country: string;
    enabledCountries = COUNTRIES;

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController) {

        this.isCountryEnabled = this.navParams.get('isCountryEnabled');
        this.city = this.navParams.get('city') ? this.navParams.get('city') : '';
        this.country = this.navParams.get('country');
    }

    getFlag(country) {
        return `assets/img/flags/${country.toLowerCase()}.svg`;
    }

    getKey(country) {
        return `COUNTRIES.${country.toUpperCase()}`;
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
