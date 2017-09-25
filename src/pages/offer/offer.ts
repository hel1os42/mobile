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

    constructor(
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private offers: OfferService) {

        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');

    }

    //ionViewDidLoad() {
    //this.nav.pop();
    //  let popover = this.popoverCtrl.create(CongratulationPopover);
    //  popover.present();
    //}

    getDistance(latitude: number, longitude: number) {
        return 200;
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    ionViewDidLeave() {
        if (this.timer)
            clearInterval(this.timer);
    }

    openRedeemPopover() {
        
        this.offers.getActivationCode('15f4f73e-f9c5-4ecb-9a02-f515e03147d7' /*this.offer.id*/)
            .subscribe((offerActivationCode: OfferActivationCode) => {
                let offerRedeemPopover = this.popoverCtrl.create(OfferRedeemPopover, { redeemingResponse: offerActivationCode });
                offerRedeemPopover.present();

                this.timer = setInterval(() => {
                    this.offers.getRedemtionStatus(offerActivationCode.code)
                        .subscribe((offerRedemtionStatus: OfferRedemtionStatus) => {
                            if (offerRedemtionStatus.redemption_id) {
                                clearInterval(this.timer);

                                offerRedeemPopover.dismiss();

                                let offerRedeemedPopover = this.popoverCtrl.create(CongratulationPopover);
                                offerRedeemedPopover.present();
                            }
                        });
                }, 3000)
            })       
    }
}
