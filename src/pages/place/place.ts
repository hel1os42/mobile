import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams) {

    }

    ionViewDidLoad() {
        let companyId = this.navParams.get('companyId');
        this.offers.getCompany(companyId)
            .subscribe(company => console.log(company));
        
        ;
    }
}