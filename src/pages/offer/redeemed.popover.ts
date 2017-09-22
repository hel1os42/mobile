import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

@Component({
    selector: 'redeemed-popover-component',
    templateUrl: 'redeemed.popover.html'
})

export class RedeemedPopover {
    constructor(
        private viewCtrl: ViewController,
        private app: App) { }

    close() {
        this.viewCtrl.dismiss();
        this.app.getRootNav().setRoot();
    }
}