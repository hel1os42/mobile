import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'page-create-offer-5',
    templateUrl: 'create-offer-5.html'
})
export class CreateOffer5Page {

    offer: OfferCreate;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private offerService: OfferService) {

        this.offer = this.navParams.get('offer');

    }

    createOffer() {
        this.offer;
        debugger;
        this.offerService.set(this.offer)
            .subscribe()//to do;
    }

}
