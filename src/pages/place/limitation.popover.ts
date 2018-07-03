import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { LimitationFlagsUtils } from '../../utils/limitation-flags.utils';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'limitation-popover-component',
    templateUrl: 'limitation.popover.html'
})

export class LimitationPopover {

    OFFER_REFERRAL_PRICE = 'referral_points_price';
    OFFER_REDEMPTION_PRICE = 'redemption_points_price';
    USER_REFERRAL_POINTS = 'referral_points';
    USER_REDEMPTION_POINTS = 'redemption_points';
    offer: Offer;
    keys = [];
    user: User;
    messages = [];
    message: string;
    PAGE_KEY = 'PAGE_PLACE.';
    LIMITATION_128 = 'LIMITATION_128';
    LIMITATION_256 = 'LIMITATION_256';

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private translate: TranslateService) {

        this.offer = this.navParams.get('offer');
        this.user = this.navParams.get('user');
        this.keys = LimitationFlagsUtils.extractFlags(this.offer.redemption_access_code);
        this.getTranslations();
    }

    getTranslations() {
        this.keys.forEach(key => {
            this.translate.get(this.PAGE_KEY + key)
                .subscribe(resp => {
                    let str = resp;
                    if (key === this.LIMITATION_128 || key === this.LIMITATION_256) {
                        str = this.addPointsValues(str);
                    }
                    this.messages.push(str);
                });
        });
        if (this.messages.length > 0) {
            this.message = this.messages[0];// only one limitation message
        }
    }

    addPointsValues(str: string) {
        return str.replace(this.OFFER_REDEMPTION_PRICE, this.offer[this.OFFER_REDEMPTION_PRICE])
            .replace(this.OFFER_REFERRAL_PRICE, this.offer[this.OFFER_REFERRAL_PRICE])
            .replace(this.USER_REDEMPTION_POINTS, this.user[this.USER_REDEMPTION_POINTS])
            .replace(this.USER_REFERRAL_POINTS, this.user[this.USER_REFERRAL_POINTS]);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}