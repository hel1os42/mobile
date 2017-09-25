import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'offerRedeem-popover-component',
    templateUrl: 'offerRedeem.popover.html'
})

export class OfferRedeemPopover {

    redeemingResponse;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,) { 
        
        this.redeemingResponse = this.navParams.get('offerActivationCode');       
    
    }

    close() {
        this.viewCtrl.dismiss();
    }
}