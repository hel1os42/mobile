import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';

@Component({
    selector: 'offerRedeem-popover-component',
    templateUrl: 'offerRedeem.popover.html'
})

export class OfferRedeemPopover {

    redeemingResponse;

    constructor(
        private viewCtrl: ViewController,
        private app: App,
        private navParams: NavParams,) { 
        
        this.redeemingResponse = this.navParams.get('redeemingResponse');
        }

    close() {
        this.viewCtrl.dismiss();
        this.app.getRootNav().setRoot();
    }
}