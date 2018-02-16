import { DistanceUtils } from '../../utils/distanse.utils';
import { Coords } from '../../models/coords';
import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Place } from '../../models/place';
import { Offer } from '../../models/offer';
import { OfferActivationCode } from '../../models/offerActivationCode';
import { OfferRedemtionStatus } from '../../models/offerRedemtionStatus';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { CongratulationPopover } from './congratulation.popover';
import { OfferRedeemPopover } from './offerRedeem.popover';

@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html'
})
export class OfferPage {

    offer: Offer;
    company = new Place;
    offerActivationCode: OfferActivationCode;
    timer;
    distanceString: string;
    distance: number;
    coords: Coords;

    constructor(
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private offers: OfferService,
        private app: App,
        private profile: ProfileService,
        private alertCtrl: AlertController) {

        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');
        this.distanceString = this.navParams.get('distanceStr');
        this.coords = this.navParams.get('coords');
        this.distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, this.offer.latitude, this.offer.longitude);
    }

    ngAfterViewInit() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.opacity = '0';
                tabs[key].style.pointerEvents = 'none';
            });
        }
    }

    ionViewWillUnload() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.opacity = '1';
                tabs[key].style.pointerEvents = 'all';
            });
        }
    }

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
        this.app.navPop();
    }

    disable() {
        if (this.offer.radius < this.distance) {//to do add delivery etc.
            return true;
        }
        else {
            return false;
        }
    }

    presentAlert() {
        let alert = this.alertCtrl.create({
          title: 'You are located too far',
          buttons: ['Ok']
        });
        alert.present();
      }

    openRedeemPopover() {
        if (!this.disable()) {
            if (this.timer)
                return;

            this.offers.getActivationCode(this.offer.id)
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
                                    this.profile.refreshAccounts();
                                    offerRedeemPopover.dismiss();

                                    let offerRedeemedPopover = this.popoverCtrl.create(CongratulationPopover, { company: this.company });
                                    offerRedeemedPopover.present();
                                    offerRedeemedPopover.onDidDismiss(() => this.nav.popToRoot());
                                }
                            });
                    }, 3000)
                })
        }
        else {
            this.presentAlert()
        }
    }
}
