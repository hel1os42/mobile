import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'notice-popover-component',
    templateUrl: 'notice.popover.html'
})

export class NoticePopover {

    offer: Offer;
    user: User;
    FRIENDS_AND_REDEMPTIONS_POINTS = 'CONFIRM.FRIENDS_AND_REDEMPTIONS_POINTS';
    FRIENDS_POINTS = 'CONFIRM.FRIENDS_POINTS';
    REDEMPTIONS_POINTS = 'CONFIRM.REDEMPTIONS_POINTS';
    OFFER_REFERRAL_PRICE = 'referral_points_price';
    OFFER_REDEMPTION_PRICE = 'redemption_points_price';
    USER_REFERRAL_POINTS = 'referral_points';
    USER_REDEMPTION_POINTS = 'redemption_points';
    
    message = '';

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private translate: TranslateService) {

        this.offer = this.navParams.get('offer');
        this.user = this.navParams.get('user');
        let key = this.offer.referral_points_price && this.offer.redemption_points_price
        ? this.FRIENDS_AND_REDEMPTIONS_POINTS
        : this.offer.referral_points_price && !this.offer.redemption_points_price
        ? this.FRIENDS_POINTS
        : !this.offer.referral_points_price && this.offer.redemption_points_price
        ? this.REDEMPTIONS_POINTS : '';
        if (key && key !== '') {
            this.translate.get(key)
                .subscribe((resp: string) => {
                    this.message = resp.replace(this.OFFER_REDEMPTION_PRICE, this.offer[this.OFFER_REDEMPTION_PRICE])
                    .replace(this.OFFER_REFERRAL_PRICE, this.offer[this.OFFER_REFERRAL_PRICE])
                    .replace(this.USER_REDEMPTION_POINTS, this.user[this.USER_REDEMPTION_POINTS])
                    .replace(this.USER_REFERRAL_POINTS, this.user[this.USER_REFERRAL_POINTS]);
                })
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }
}