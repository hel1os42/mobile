import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'noPlaces-popover-component',
    templateUrl: 'noPlaces.popover.html'
})

export class NoPlacesPopover {

    isCountryEnabled: boolean;
    city: string;
    country: string;

    constructor(private navParams: NavParams) {

        this.isCountryEnabled = this.navParams.get('isCountryEnabled');
        this.city = this.navParams.get('city') ? this.navParams.get('city') : '';
        this.country = this.navParams.get('country');
        debugger
    }
}
