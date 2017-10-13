import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlaceService } from '../../providers/place.service';

@Component({
    selector: 'page-adv-redeem-offer',
    templateUrl: 'adv-redeem-offer.html'
})
export class AdvRedeemOfferPage {

    code: string;

    constructor(
        private nav: NavController,
        private place: PlaceService) {

    }

    sendCode() {
        this.place.setRedeemCode(this.code)
            .subscribe(() => this.nav.pop());
    }

}
