import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';

@Component({
    selector: 'page-create-offer-2',
    templateUrl: 'create-offer-2.html'
})
export class CreateOffer2Page {

    offer = new OfferCreate;
    isDetailedSettingsVisible: boolean = false;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;

    }

    openCreateOffer3Page() {
        this.nav.push(CreateOffer3Page, { offer: this.offer });
        debugger;
    }

}
