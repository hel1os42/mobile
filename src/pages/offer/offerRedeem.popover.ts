import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { OfferTermsPage } from '../offer-terms/offer-terms';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'offerRedeem-popover-component',
    templateUrl: 'offerRedeem.popover.html'
})

export class OfferRedeemPopover {

    redeemingResponse;
    qrWith: number;
    termsUrl = 'http://nau.io/terms';

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private nav: NavController,
        private browser: InAppBrowser) { 
        
        this.redeemingResponse = this.navParams.get('offerActivationCode');
        this.qrWith = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.qrWith = this.qrWith / 2;

    }

    close() {
        this.viewCtrl.dismiss();
    }

    // openOfferTerms() {
    //     this.nav.push(OfferTermsPage)
    // }

    loadUrl() {
        this.browser.create(this.termsUrl, '_system');
    }

}