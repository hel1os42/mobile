import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdvertiserService } from '../../providers/advertiser.service';

@Component({
    selector: 'page-adv-redeem-offer',
    templateUrl: 'adv-redeem-offer.html'
})
export class AdvRedeemOfferPage {

    code: string;

    constructor(
        private nav: NavController,
        private advert: AdvertiserService) {

    }

    sendCode() {
        this.advert.setRedeemCode(this.code)
            .subscribe(() => this.nav.pop());
    }

}
