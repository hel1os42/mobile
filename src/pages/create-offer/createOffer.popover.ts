import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { CreateOfferPage } from './create-offer';

@Component({
    selector: 'createOffer-popover-component',
    templateUrl: 'createOffer.popover.html'
})

export class CreateOfferPopover {
    constructor(
        private viewCtrl: ViewController,
        private app: App) { }

    close() {
        this.viewCtrl.dismiss();
    }
}