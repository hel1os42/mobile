import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { CreateOfferPage } from './create-offer';

@Component({
    selector: 'popover-component',
    templateUrl: 'popover.component.html'
})

export class PopoverComponent {
    constructor(
        private viewCtrl: ViewController,
        private app: App) { }

    close() {
        this.viewCtrl.dismiss();
        this.app.getRootNav().setRoot(CreateOfferPage);
    }
}