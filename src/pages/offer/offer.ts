import { Component } from '@angular/core';
import { NavController, PopoverController, App, NavParams } from 'ionic-angular';
import { OfferRedeemPopover } from './offerRedeem.popover';
import { CongratulationPopover } from './congratulation.popover';
import { AppModeService } from '../../providers/appMode.service';
import { Offer } from '../../models/offer';
import { Company } from '../../models/company';
import { OfferService } from '../../providers/offer.service';
import { OfferActivationCode } from '../../models/offerActivationCode'
import { OfferRedemtionStatus } from '../../models/offerRedemtionStatus';

@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html'
})
export class OfferPage {

    offer: Offer;
    company = new Company;
    offerActivationCode: OfferActivationCode;
    timer;
    distanceString: string

    constructor(
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private offers: OfferService) {

        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');
        this.distanceString = this.navParams.get('distance');
    }

    //ionViewDidLoad() {
    //this.nav.pop();
    //  let popover = this.popoverCtrl.create(CongratulationPopover);
    //  popover.present();
    //}

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    ionViewDidLeave() {
        this.stopTimer();
    }

    openRedeemPopover() {
        if (this.timer)
            return;
        
        this.offers.getActivationCode('15f4f73e-f9c5-4ecb-9a02-f515e03147d7' /*this.offer.id*/)
            .subscribe((offerActivationCode: OfferActivationCode) => {
                if (this.timer)
                    return;

                let offerRedeemPopover = this.popoverCtrl.create(OfferRedeemPopover, { offerActivationCode: offerActivationCode });
                offerRedeemPopover.present();
                offerRedeemPopover.onDidDismiss(() => this.stopTimer());

                this.timer = setInterval(() => {
                    this.offers.getRedemtionStatus(offerActivationCode.code)
                        .subscribe((offerRedemtionStatus: OfferRedemtionStatus) => {
                            if (offerRedemtionStatus.redemption_id) {
                                this.stopTimer();

                                offerRedeemPopover.dismiss();

                                let offerRedeemedPopover = this.popoverCtrl.create(CongratulationPopover);
                                offerRedeemedPopover.present();
                                offerRedeemedPopover.onDidDismiss(() => this.nav.popToRoot());
                            }
                        });
                }, 3000)
            })       
    }
}
