import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { OfferTermsPage } from '../offer-terms/offer-terms';

@Component({
    selector: 'offerRedeem-popover-component',
    templateUrl: 'offerRedeem.popover.html'
})

export class OfferRedeemPopover {

    redeemingResponse;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private nav: NavController) { 
        
        this.redeemingResponse = this.navParams.get('offerActivationCode');       
    
    }

    close() {
        this.viewCtrl.dismiss();
    }

    openOfferTerms() {
        this.nav.push(OfferTermsPage)
    }
}