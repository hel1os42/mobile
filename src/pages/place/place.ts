import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {

    constructor(private nav: NavController,
                private offerService: OfferService) {

    }

    ionViewDidLoad() {
        //this.offerService.getOffersList();to do
    }

}