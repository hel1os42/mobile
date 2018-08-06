import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, App, NavController, NavParams, Platform, PopoverController, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { OfferActivationCode } from '../../models/offerActivationCode';
import { OfferRedemtionStatus } from '../../models/offerRedemtionStatus';
import { Place } from '../../models/place';
import { User } from '../../models/user';
import { AdjustService } from '../../providers/adjust.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { AppModeService } from '../../providers/appMode.service';
import { FavoritesService } from '../../providers/favorites.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { ToastService } from '../../providers/toast.service';
import { DateTimeUtils } from '../../utils/date-time.utils';
import { DistanceUtils } from '../../utils/distanse.utils';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { LimitationPopover } from '../place/limitation.popover';
import { PlacePage } from '../place/place';
import { UserProfilePage } from '../user-profile/user-profile';
import { CongratulationPopover } from './congratulation.popover';
import { LinkPopover } from './link.popover';
import { OfferRedeemPopover } from './offerRedeem.popover';
import { TimeframesPopover } from './timeframes.popover';

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
    links = [];
    isDismissLinkPopover = true;
    // today: Date;
    todayTimeframe;
    timeframes;
    isTodayIncluded = false;
    onRefreshCompany: Subscription;
    onRefreshUser: Subscription;
    user: User;
    isGettingRedemptionStatus;
    HTTP_STATUS_CODE_UNATHORIZED = 401;

    constructor(
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private offers: OfferService,
        private app: App,
        private profile: ProfileService,
        private share: ShareService,
        private favorites: FavoritesService,
        private toast: ToastService,
        private alert: AlertController,
        private statusBar: StatusBar,
        private gAnalytics: GoogleAnalytics,
        private browser: InAppBrowser,
        private translate: TranslateService,
        private adjust: AdjustService,
        private platform: Platform,
        private appMode: AppModeService,
        private analytics: AnalyticsService) {

        this.adjust.setEvent('OFFER_VIEW');
        // this.today = new Date();
        if (this.share.get()) {
            this.share.remove();
        }

        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');
        this.distanceObj = this.navParams.get('distanceObj');
        this.coords = this.navParams.get('coords');
        this.user = this.navParams.get('user');

        if (!this.user) {
            this.profile.get(true, false)
                .subscribe(user => this.user = user);
        }

        this.offers.get(this.offer.id, true)
            .subscribe(offer => {
                if (offer.timeframes) {
                    this.offer = offer;
                }
                // console.log(this.offer);
                // console.log(this.company);
                this.offer.is_favorite = this.navParams.get('offer').is_favorite;//temporary fix

                this.distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, this.offer.latitude, this.offer.longitude);
                this.timeframesHandler();
            });

        this.onRefreshCompany = this.offers.onRefreshPlace
            .subscribe(company => {
                this.company = company;
                if (company.offers && company.offers.length > 0) {
                    let offer = company.offers.find(offer => offer.id === this.offer.id);
                    if (offer) {
                        this.offer = _.extend(this.offer, offer)
                    }
                }
            });

        this.onRefreshUser = this.profile.onRefresh
            .subscribe(user => this.user = user);
    }

    ionViewDidLoad() {
        this.statusBar.styleLightContent();
    }

    // ngAfterViewInit() {
    //     let tabs = document.querySelectorAll('.show-tabbar');
    //     if (tabs !== null) {
    //         Object.keys(tabs).map((key) => {
    //             tabs[key].style.opacity = '0';
    //             tabs[key].style.pointerEvents = 'none';
    //         });
    //     }
    // }

    // ionViewWillUnload() {
    //     let tabs = document.querySelectorAll('.show-tabbar');
    //     if (tabs !== null) {
    //         Object.keys(tabs).map((key) => {
    //             tabs[key].style.opacity = '1';
    //             tabs[key].style.pointerEvents = 'all';
    //         });
    //     }
    // }

    timeframesHandler() {
        // this.offer.timezone_offset = -10800;//temporary - will removed
        if (this.offer.timeframes && this.offer.timeframes.length > 0 && this.offer.timeframes_offset) {
            let timeframe = DateTimeUtils.getOfferTimeframes(this.offer.timeframes, this.offer.timeframes_offset);
            this.isTodayIncluded = timeframe.isIncluded;
            this.todayTimeframe = timeframe.day;
            this.timeframes = timeframe.timeFrames;
        } else {
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
            } else {
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
            } else {
                this.browser.create(href, '_system');
            }
        } else return;
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

    // disable() {
    //     if (this.offer.radius < this.distance) {//to do add delivery etc.
    //         return true;
    //     }
    //     return false;
    // }

    // presentAlert() {
    //     let alert = this.alertCtrl.create({
    //         title: 'You are located too far',
    //         buttons: ['Ok']
    //     });
    //     alert.present();
    // }

    openRedeemPopover() {
        this.adjust.setEvent('REDEEM_BUTTON_CLICK');

        if (this.platform.is('cordova') && this.appMode.getEnvironmentMode() === 'prod') {
            let label = `user_phone: ${this.user.phone},
            user_coords: (${this.user.latitude},${this.user.longitude}), 
            user_id: ${this.user.id}, 
            place_name: ${this.company.name},
            place_coords: (${this.company.latitude},${this.company.longitude}),
            place_id: ${this.company.id}, 
            offer_label: ${this.offer.label},
            offer_id: ${this.offer.id}`;
            this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'redeem_button_click', label);
        }

        this.timeframesHandler();
        // if (!this.disable()) {distance validation
        if (!this.offer.redemption_access_code) {

            if (this.isTodayIncluded) {
                // if (this.timer)
                //     return;
                if (this.isGettingRedemptionStatus)
                    return;

                this.offers.getActivationCode(this.offer.id)
                    .subscribe((offerActivationCode: OfferActivationCode) => {
                        // if (this.timer)
                        //     return;
                        if (this.isGettingRedemptionStatus)
                            return;
                        // let noticePopover = this.popoverCtrl.create(NoticePopover);
                        let offerRedeemPopover = this.popoverCtrl.create(
                            OfferRedeemPopover,
                            { offerActivationCode: offerActivationCode },
                            { enableBackdropDismiss: false }
                        );
                        offerRedeemPopover.present();
                        // noticePopover.present();
                        // noticePopover.onDidDismiss(() => offerRedeemPopover.present());
                        offerRedeemPopover.onDidDismiss(() => {
                            // this.stopTimer();
                            this.isGettingRedemptionStatus = false;
                            this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'event_showqr');
                        });

                        // this.timer = setInterval(() => {}, 2500)
                        this.isGettingRedemptionStatus = true;
                        this.getRedemptionStatus(offerActivationCode.code, offerRedeemPopover);
                    })
                // }
                // else {
                //     this.presentAlert()
                // }
            } else {
                let popover = this.popoverCtrl.create(TimeframesPopover, {
                    timeFrames: this.timeframes,
                    label: this.offer.label,
                    day: this.todayTimeframe
                });
                popover.present();
            }
        } else {
            let limitationPopover = this.popoverCtrl.create(LimitationPopover, { offer: this.offer, user: this.user });
            limitationPopover.present();
        }
    }

    // getRedemptionStatus(code, popover, counterErr?: number) {
    getRedemptionStatus(code, popover) {
        if (this.isGettingRedemptionStatus) {

            // let counter = counterErr;

            this.offers.getRedemptionStatus(code)
                .subscribe((offerRedemtionStatus: OfferRedemtionStatus) => {
                    if (offerRedemtionStatus.redemption_id) {

                        if (this.isGettingRedemptionStatus) {
                            // this.stopTimer();
                            this.isGettingRedemptionStatus = false;
                            popover.dismiss();

                            this.offers.refreshRedeemedOffers();
                            this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'event_redeemoffer', offerRedemtionStatus.redemption_id);
                            this.analytics.faLogEvent('event_redeemoffer');
                            this.adjust.setEvent('ACTION_REDEMPTION');

                            let congratulationPopover = this.popoverCtrl.create(
                                CongratulationPopover,
                                { company: this.company, offer: this.offer },
                                { cssClass: 'position-top' }
                            );
                            congratulationPopover.present();
                            congratulationPopover.onDidDismiss(data => {
                                // if (data && data.isAdded) {
                                //     this.toast.showNotification('TOAST.ADDED_TO_TESTIMONIALS');
                                // }
                                this.offers.refreshPlace(this.company.id);
                                if (this.offer.is_featured) {
                                    this.offers.refreshFeaturedOffers(this.coords.lat, this.coords.lng);
                                }
                            });
                        }
                    } else {
                        setTimeout(() => {
                            this.getRedemptionStatus(code, popover);
                        }, 1000);
                    }
                },
                    err => {
                        // if (!counter) counter = 0;
                        // counter++;
                        // if (err.status == HTTP_STATUS_CODE_UNATHORIZED || counter == 5) {
                        if (err.status == this.HTTP_STATUS_CODE_UNATHORIZED) {
                            popover.dismiss();
                            this.isGettingRedemptionStatus = false;
                            // this.presentAlert(err.status);
                            return;
                        }
                        setTimeout(() => {
                            // this.getRedemptionStatus(code, popover, counter);
                            this.getRedemptionStatus(code, popover);
                        }, 1000);
                    });
        }
    }

    // presentAlert(errStatus: string) {
    //     this.translate.get('UNIT')
    //         .subscribe(unit => {
    //             let alert = this.alert.create({
    //                 title: unit['ERROR'] + ': ' + errStatus,
    //                 buttons: [unit['OK']]
    //             });
    //             alert.present();
    //         })
    // }

    shareOffer() {
        if (this.user && this.user.invite_code && this.company.id && this.offer) {
            this.translate.get('SHARING.OFFER')
                .subscribe(translation => {
                    const Branch = window['Branch'];
                    this.profile.get(false)
                        .subscribe(profile => {

                            let properties = {
                                canonicalIdentifier: `?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                                canonicalUrl: `${this.branchDomain}?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                                title: this.offer.label,
                                contentDescription: this.getDescription(this.offer.rich_description),
                                contentImageUrl: this.offer.picture_url,
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
                                    let message = translation;
                                    branchUniversalObj.showShareSheet(analytics, properties, message);

                                    branchUniversalObj.onLinkShareResponse(res => {
                                        this.adjust.setEvent('SHARE_OFFER_BUTTON_CLICK');
                                    });
                                })
                        })
                })
        }
    }

    getDescription(str) {
        // let count = (str.match(/<a href/g) || []).length;
        // console.log(str.replace(/<[^>]+>/g, '').replace(/\r?\n|\r/g, ''));
        return str.replace(/<[^>]+>/g, '').replace(/\r?\n|\r/g, '');
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
        this.adjust.setEvent('PHONE_ICON_CLICK');
        window.location = 'tel:' + this.company.phone;
    }

    openSite() {
        this.adjust.setEvent('WEBSITE_ICON_CLICK');
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
        // this.stopTimer();
        this.isGettingRedemptionStatus = false;
        this.app.navPop();
        //
        let nav: any = this.nav;
        let root = nav.root;
        let views: ViewController[] = nav.getViews();
        let component = views.find(view => view.component === PlacePage);
        if ((root === BookmarksPage && !component) || (root === UserProfilePage && !component)) {
            this.statusBar.styleDefault();
        }
    }

    ngOnDestroy() {
        this.onRefreshCompany.unsubscribe();
        this.onRefreshUser.unsubscribe();
    }

}
