import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
import { AlertController, App, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { OfferActivationCode } from '../../models/offerActivationCode';
import { OfferRedemtionStatus } from '../../models/offerRedemtionStatus';
import { Place } from '../../models/place';
import { FavoritesService } from '../../providers/favorites.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { ToastService } from '../../providers/toast.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { CongratulationPopover } from './congratulation.popover';
import { LinkPopover } from './link.popover';
import { OfferRedeemPopover } from './offerRedeem.popover';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeUtils } from '../../utils/date-time.utils';
import { TimeframesPopover } from './timeframes.popover';
import { NoticePopover } from './notice.popover';
import { AnalyticsService } from '../../providers/analytics.service';

declare var window;

@Component({
    selector: 'page-offer',
    templateUrl: 'offer.html'
})
export class OfferPage {

    offer: Offer;
    company = new Place;
    offerActivationCode: OfferActivationCode;
    timer;
    distanceObj;
    distance: number;
    coords: Coords;
    branchDomain = 'https://nau.app.link';
    points: number;
    links = [];
    isDismissLinkPopover = true;
    today: Date;
    todayTimeframe;
    timeframes;
    isTodayIncluded = false;

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
        private alert: AlertController,
        private statusBar: StatusBar,
        private gAnalytics: GoogleAnalytics,
        private analytics: AnalyticsService,
        private browser: InAppBrowser,
        private translate: TranslateService) {

        this.today = new Date();
        this.points = 1;
        if (this.share.get()) {
            this.share.remove();
        }
        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');
        this.distanceObj = this.navParams.get('distanceObj');
        this.coords = this.navParams.get('coords');
        this.offers.get(this.offer.id)
            .subscribe(offer => {
                if (offer.timeframes) {
                    this.offer = offer;
                }
                console.log(this.offer);
                console.log(this.company);
                this.offer.is_favorite = this.navParams.get('offer').is_favorite;//temporary fix

                this.distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, this.offer.latitude, this.offer.longitude);
                this.timeframesHandler();
            })
    }

    ionViewDidLoad() {
        this.statusBar.styleLightContent();
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

    timeframesHandler() {
        // this.offer.timezone_offset = -10800;//temporary - will removed
        if (this.offer.timeframes && this.offer.timeframes.length > 0 && this.offer.timeframes_offset) {
            let timeframe = DateTimeUtils.getOfferTimeframes(this.today, this.offer.timeframes, this.offer.timeframes_offset);
            this.isTodayIncluded = timeframe.isIncluded;
            this.todayTimeframe = timeframe.day;
            this.timeframes = timeframe.timeFrames;
        }
        else {
            this.isTodayIncluded = true;
        }
    }

    openLinkPopover(event) {
        if (event.target.localName === 'a' && this.isDismissLinkPopover) {
            this.isDismissLinkPopover = false;
            let title = event.target.innerText;
            let split = event.target.href.slice(event.target.href.length - 1);
            let host: string;
            let href: string;
            if (split && split === '#') {
                let link = this.links.find(link => link.title === title);
                href = link.href;
                host = link.host;
            }
            else {
                href = event.target.href;
                host = event.target.host;
            }
            if (host === 'api.nau.io' || host === 'api-test.nau.io' || host === 'nau.toavalon.com') {
                if (this.links.filter(link => link.title === title).length == 0) {
                    this.links.push({
                        host: host,
                        title: title,
                        href: href
                    });
                }
                event.target.href = '#';
                let endpoint = href.split('places')[1];
                this.offers.getLink(endpoint)
                    .subscribe(link => {
                        event.target.href = href;
                        let linkPopover = this.popoverCtrl.create(LinkPopover, { link: link });
                        linkPopover.present();
                        linkPopover.onDidDismiss(() => this.isDismissLinkPopover = true);
                    })
            }
            else {
                this.browser.create(href, '_system');
            }
        }
        else return;



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
        if (this.isTodayIncluded) {
            if (this.timer)
                return;

            this.offers.getActivationCode(this.offer.id)
                .subscribe((offerActivationCode: OfferActivationCode) => {
                    if (this.timer)
                        return;

                    let noticePopover = this.popoverCtrl.create(NoticePopover);
                    let offerRedeemPopover = this.popoverCtrl.create(
                        OfferRedeemPopover,
                        { offerActivationCode: offerActivationCode },
                        { enableBackdropDismiss: false }
                    );
                    noticePopover.present();
                    noticePopover.onDidDismiss(() => offerRedeemPopover.present());
                    offerRedeemPopover.onDidDismiss(() => {
                        this.stopTimer();
                        this.gAnalytics.trackEvent("Session", 'event_showqr');
                    });

                    this.timer = setInterval(() => {
                        this.offers.getRedemtionStatus(offerActivationCode.code)
                            .subscribe((offerRedemtionStatus: OfferRedemtionStatus) => {
                                if (offerRedemtionStatus.redemption_id) {
                                    this.stopTimer();
                                    this.profile.refreshAccounts();
                                    offerRedeemPopover.dismiss();
                                    this.offers.refreshRedeemedOffers();
                                    let offerCongratulationPopover = this.popoverCtrl.create(CongratulationPopover, { company: this.company, offer: this.offer });
                                    offerCongratulationPopover.present();
                                    this.gAnalytics.trackEvent("Session", 'event_redeemoffer');
                                    this.analytics.faLogEvent('event_redeemoffer');
                                    offerCongratulationPopover.onDidDismiss(() => {
                                        // this.nav.popToRoot();
                                        // if (data.status === 'approved') {
                                        //     this.company.testimonials_count = this.company.testimonials_count + 1;
                                        // }
                                    });
                                }
                            });
                    }, 2500)
                })
            // }
            // else {
            //     this.presentAlert()
            // }
        }
        else {
            let popover = this.popoverCtrl.create(TimeframesPopover, {
                timeFrames: this.timeframes,
                label: this.offer.label,
                day: this.todayTimeframe
            });
            popover.present();
        }
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
                this.toast.showNotification('TOAST.ADDED_TO_FAVORITES');
            });
    }

    dial() {
        window.location = 'tel:' + this.company.phone;
    }

    openSite() {
        this.browser.create(this.company.site, '_system');
    }

    presentConfirm() {
        this.translate.get(['CONFIRM.REMOVE_FAVORITE_OFFER', 'UNIT'])
            .subscribe(resp => {
                let unit = resp['UNIT'];
                let title = resp['CONFIRM.REMOVE_FAVORITE_OFFER'];
                const alert = this.alert.create({
                    title: title,
                    buttons: [{
                        text: unit['CANCEL'],
                        role: 'cancel',
                        handler: () => {
                            return;
                        }
                    }, {
                        text: unit['OK'],
                        handler: () => {
                            this.removeFavorite();
                        }
                    }]
                });
                alert.present();
            })
    }

    ionViewDidLeave() {
        this.stopTimer();
        this.app.navPop();
        //
        let nav: any = this.nav;
        let root = nav.root;
        if (root === BookmarksPage) {
            this.statusBar.styleDefault();
        }
    }

}
