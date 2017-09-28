import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'page-adv-redeem-offer',
    templateUrl: 'adv-redeem-offer.html'
})
export class AdvRedeemOfferPage {

    code: string;

    constructor(
        private nav: NavController,
        private offers: OfferService) {

    }

    sendCode() {
        this.offers.setRedeemCode(this.code)
            .subscribe(() => this.nav.pop());
    }

}
