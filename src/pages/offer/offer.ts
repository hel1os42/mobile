import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { OfferActivationCode } from '../../models/offerActivationCode';
import { OfferRedemtionStatus } from '../../models/offerRedemtionStatus';
import { Place } from '../../models/place';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { CongratulationPopover } from './congratulation.popover';
import { OfferRedeemPopover } from './offerRedeem.popover';
import { FavoritesService } from '../../providers/favorites.service';
import { ToastService } from '../../providers/toast.service';

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
    branchDomain = 'https://nau.app.link';

    constructor(
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private offers: OfferService,
        private app: App,
        private profile: ProfileService,
        private alertCtrl: AlertController,
        private share: ShareService,
        private favorites: FavoritesService,
        private toast: ToastService,
        private alert: AlertController) {

        if (this.share.get()) {
            this.share.remove();
        }
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
        // if (!this.disable()) {distance validation
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
                                    this.offers.refreshRedeemedOffers();
                                    let offerRedeemedPopover = this.popoverCtrl.create(CongratulationPopover, { company: this.company, offer: this.offer });
                                    offerRedeemedPopover.present();
                                    offerRedeemedPopover.onDidDismiss(() => this.nav.popToRoot());
                                }
                            });
                    }, 2500)
                })
        // }
        // else {
        //     this.presentAlert()
        // }
    }

    shareOffer() {
        const Branch = window['Branch'];
        this.profile.get(false)
            .subscribe(profile => {
                let properties = {
                    canonicalIdentifier: `?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                    canonicalUrl: `${this.branchDomain}/?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                    title: this.offer.label,
                    contentDescription: this.offer.description,
                    contentImageUrl: this.offer.picture_url + '?size=mobile',
                    // price: 12.12,
                    // currency: 'GBD',
                    contentIndexingMode: 'private',
                    contentMetadata: {
                        page: 'offer',
                        invite_code: profile.invite_code,
                        placeId: this.company.id,
                        offerId: this.offer.id
                    }
                };
                var branchUniversalObj = null;
                Branch.createBranchUniversalObject(properties)
                    .then(res => {
                        branchUniversalObj = res;
                        let analytics = {};
                        // let message = this.company.name + this.company.description
                        let message = 'NAU';
                        branchUniversalObj.showShareSheet(analytics, properties, message)
                            .then(resp => console.log(resp))
                    }).catch(function (err) {
                        console.log('Branch create obj error: ' + JSON.stringify(err))
                    })

            })
    }

    removeFavorite() {
        this.favorites.removeOffer(this.offer.id)
            .subscribe(() => this.offer.is_favorite = false);
    }

    addFavorite() {
        this.favorites.setOffer(this.offer.id)
            .subscribe(() => {
                this.offer.is_favorite = true;
                this.toast.showNotification('Added to favorites');
            });
    }

    
    presentConfirm() {
        const alert = this.alert.create({
            title: 'Are you sure you want to remove offer from favorites?',
            
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    return;
                }
            }, {
                text: 'Ok',
                handler: () => {
                    this.removeFavorite();
                }
            }]
        });
        alert.present();
    }

    ionViewDidLeave() {
        this.stopTimer();
        this.app.navPop();
    }
}
