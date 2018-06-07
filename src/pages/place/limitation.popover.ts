import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { LimitationFlagsUtils } from '../../utils/limitation-flags.utils';
import { User } from '../../models/user';

@Component({
    selector: 'limitation-popover-component',
    templateUrl: 'limitation.popover.html'
})

export class LimitationPopover {

    offer: Offer;
    keys = [];
    user: User;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.offer = this.navParams.get('offer');
        this.user = this.navParams.get('user');
        this.keys = LimitationFlagsUtils.extractFlags(this.offer.redemption_access_code);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}