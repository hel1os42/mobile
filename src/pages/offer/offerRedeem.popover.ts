import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { OfferTermsPage } from '../offer-terms/offer-terms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';


@Component({
    selector: 'offerRedeem-popover-component',
    templateUrl: 'offerRedeem.popover.html'
})

export class OfferRedeemPopover {

    redeemingResponse;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams,
                private nav: NavController,
                private barcode: BarcodeScanner) { 
        
        this.redeemingResponse = this.navParams.get('offerActivationCode');
    
    }

    close() {
        this.viewCtrl.dismiss();
    }

    openOfferTerms() {
        this.nav.push(OfferTermsPage)
    }

    encodeRedeemingResponse () {
        this.barcode.encode(this.barcode.Encode.TEXT_TYPE, this.redeemingResponse.code)
            .then(res => console.log(res));
    }


}