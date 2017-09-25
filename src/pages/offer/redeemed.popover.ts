import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';

@Component({
    selector: 'redeemed-popover-component',
    templateUrl: 'redeemed.popover.html'
})

export class RedeemedPopover {

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