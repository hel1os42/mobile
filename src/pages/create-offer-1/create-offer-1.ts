import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer2Page } from '../create-offer-2/create-offer-2';

@Component({
    selector: 'page-create-offer-1',
    templateUrl: 'create-offer-1.html'
})
export class CreateOffer1Page {

    offer: OfferCreate;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

  }

  openCreateOffer2Page() {
    this.nav.push(CreateOffer2Page, { offer: this.offer });//add bindings (category & type, type)
}

}