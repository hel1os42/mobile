import { Component, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController, PopoverController, Slides } from 'ionic-angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Rx';
import { Account } from '../../models/account';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { User } from '../../models/user';
import { AdjustService } from '../../providers/adjust.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { TransactionService } from '../../providers/transaction.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { LinkPopover } from '../offer/link.popover';
import { LimitationPopover } from '../place/limitation.popover';
import { PlacePage } from '../place/place';
import { SettingsPage } from '../settings/settings';
import { UserAchievePage } from '../user-achieve/user-achieve';
import { UserNauPage } from '../user-nau/user-nau';
import { UserOffersPage } from '../user-offers/user-offers';
import { UserTasksPage } from '../user-tasks/user-tasks';
import { UserUsersPage } from '../user-users/user-users';
import { FavoritesService } from '../../providers/favorites.service';

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {

    user: User = new User();
    balance: number;
    onRefreshAccounts: Subscription;
    onRefreshCoords: Subscription;
    onRefreshProfileCoords: Subscription;
    onRefreshUser: Subscription;
    onRefreshFavoritesOffers: Subscription;
    onRefreshFavoritesPlaces: Subscription;
    NAU: Account;
    branchDomain = 'https://nau.app.link';
    allowPremiumOffers = [];//allowPremiumOffers: Offers[];
    premiumOffers = [];//premiumOffers: Offers[];
    coords: Coords;
    segment;
    loadingLocation;
    allowOffersPage = 1;
    offersPage = 1;
    allowOffersLastPage: number;
    offersLastPage: number;
    isLeftArrowVisible: boolean;
    isRightArrowVisible: boolean;
    isSegmented: boolean;
    isDismissLinkPopover = true;
    timer;
    isClick = false;
    MAX_POINTS = 100 * 1000;// for all premium offers list

    @ViewChild('allowOffersSlides') allowOffersSlides: Slides;
    @ViewChild('offersSlides') offersSlides: Slides;

    constructor(
        private profile: ProfileService,
        private nav: NavController,
        private auth: AuthService,
        private alert: AlertController,
        private transaction: TransactionService,
        private translate: TranslateService,
        private adjust: AdjustService,
        private location: LocationService,
        private offer: OfferService,
        private loading: LoadingController,
        private appMode: AppModeService,
        private gAnalytics: GoogleAnalytics,
        private analytics: AnalyticsService,
        private popoverCtrl: PopoverController,
        private browser: InAppBrowser,
        private favorites: FavoritesService) {

        this.segment = 'allow';

        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.user = resp;
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
                this.user.picture_url = this.user.picture_url + '?' + new Date().valueOf();
                this.allowOffersPage = 1;
                this.offersPage = 1;
                this.getLists();
            });

        this.onRefreshUser = this.profile.onRefresh
            .subscribe(user => {
                this.user = _.extend(this.user, user);
                this.allowOffersPage = 1;
                this.offersPage = 1;
                this.getLists();
            });

        if (!this.balance) {
            this.loadingLocation = this.loading.create({ content: '' });
            this.loadingLocation.present();
            this.profile.getWithAccounts(false)
                .subscribe(resp => {
                    this.user = resp;
                    this.NAU = resp.accounts.NAU;
                    this.balance = this.NAU ? this.NAU.balance : 0;
                    this.getLists();
                },
                    err => this.dismissLoading());
        }

        this.onRefreshCoords = this.location.onRefreshCoords
            .subscribe(coords => this.coords = coords);

        this.onRefreshProfileCoords = this.location.onProfileCoordsChanged
            .subscribe(coords => this.coords = coords);

        this.onRefreshFavoritesOffers = this.favorites.onRefreshOffers
            .subscribe(offerData => {
                if (this.allowPremiumOffers && this.allowPremiumOffers.length > 0) {
                    for (let offer of this.allowPremiumOffers) {
                        if (offer.id === offerData.id) {
                            offer.is_favorite = offerData.isFavorite;
                            break;
                        }
                    }
                }
                if (this.premiumOffers && this.premiumOffers.length > 0) {
                    for (let offer of this.premiumOffers) {
                        if (offer.id === offerData.id) {
                            offer.is_favorite = offerData.isFavorite;
                            break;
                        }
                    }
                }
            });

        this.onRefreshFavoritesPlaces = this.favorites.onRefreshPlaces
            .subscribe(placeData => {
                if (this.allowPremiumOffers && this.allowPremiumOffers.length > 0) {
                    for (let offer of this.allowPremiumOffers) {
                        if (offer.account.owner.place.id === placeData.id) {
                            offer.account.owner.place.is_favorite = placeData.isFavorite;
                            break;
                        }
                    }
                }
                if (this.premiumOffers && this.premiumOffers.length > 0) {
                    for (let offer of this.premiumOffers) {
                        if (offer.account.owner.place.id === placeData.id) {
                            offer.account.owner.place.is_favorite = placeData.isFavorite;
                            break;
                        }
                    }
                }
            });
    }

    ionSelected() {
        this.profile.refreshAccounts(false);
        this.transaction.refresh();
    }

    getLists() {
        // this.loadingLocation = this.loading.create({ content: '' });
        // this.loadingLocation.present();
        this.location.getCache()
            .then(resp => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                this.getAllowOffersList();
                this.getOffersList();
            });
    }

    getAllowOffersList() {// to do
        this.offer.getPremiumList(this.coords.lat, this.coords.lng, this.user.referral_points, this.user.redemption_points, this.allowOffersPage, false)
            .subscribe(resp => {
                this.allowPremiumOffers = resp.data;
                this.allowOffersLastPage = resp.last_page;
                if (this.allowOffersSlides) {
                    this.allowOffersSlides.update();
                    this.allowOffersSlides.slideTo(0, 0, false);
                }
                this.getSegment();
                this.dismissLoading();
            },
                err => this.dismissLoading()
            );
    }

    getOffersList() {// to do
        this.offer.getPremiumList(this.coords.lat, this.coords.lng, this.MAX_POINTS, this.MAX_POINTS, this.offersPage, false)
            .subscribe(resp => {
                this.premiumOffers = resp.data;
                this.offersLastPage = resp.last_page;
                if (this.offersSlides) {
                    this.offersSlides.update();
                    this.offersSlides.slideTo(0, 0, false);
                }
                this.getSegment();
                this.dismissLoading();
            },
                err => this.dismissLoading()
            );
    }

    getSegment() {
        let isSegmented = this.isSegmented;
        this.segment = this.allowPremiumOffers && this.allowPremiumOffers.length > 0
            ? 'allow'
            : this.premiumOffers && this.premiumOffers.length > 0
                ? 'all'
                : 'allow';
        if (isSegmented) {
            this.showArrow();
        }
        this.isSegmented = true;
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {//temporary to do
        if (this.coords) {
            let long = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, latitude, longitude);
            let distance = long >= 1000 ? long / 1000 : long;
            let key = long >= 1000 ? 'UNIT.KM' : 'UNIT.M';
            return {
                distance: distance,
                key: key
            }
        };
        return undefined;
    }

    showArrow() {
        if (this.segment === 'allow') {
            this.isLeftArrowVisible = false;
            if (this.allowPremiumOffers.length > 1) {
                this.isRightArrowVisible = true;
            }
            else {
                this.isRightArrowVisible = false;
            }
        }
        else if (this.segment === 'all') {
            this.isLeftArrowVisible = false;
            if (this.premiumOffers.length > 1) {
                this.isRightArrowVisible = true;
            }
            else {
                this.isRightArrowVisible = false;
            }
        }
    }

    slideNext() {
        let slides = this.segment === 'allow'
            ? this.allowOffersSlides
            : this.offersSlides;

        slides.slideNext();
        this.slideChangeHandler(slides);
    }

    slidePrev() {
        let slides = this.segment === 'allow'
            ? this.allowOffersSlides
            : this.offersSlides;

        slides.slidePrev();
        this.slideChangeHandler(slides);
    }

    slideChangeHandler(event: Slides) {
        //   let length = event.length();
        if (event.isBeginning()) {
            this.isLeftArrowVisible = false;
        }
        else {
            this.isLeftArrowVisible = true;
        }
        if (event.isEnd()) {
            this.isRightArrowVisible = false;
            // event.lockSwipeToNext(true);
            let element = event.getNativeElement();

            if (element && element.id) {

                this.addOffers(element.id, event);
            }
        }
        else {
            this.isRightArrowVisible = true;
            event.lockSwipeToNext(false);
        }
    }

    slidePrevHandler(event: Slides) {
        if (event.isBeginning()) {
            this.isLeftArrowVisible = false;
        }
    }

    addOffers(elementId: string, event: Slides) {
        let page = elementId === 'allowOffersSlides'
            ? this.allowOffersPage
            : this.offersPage;

        let lastPage = elementId === 'allowOffersSlides'
            ? this.allowOffersLastPage
            : this.offersLastPage;
        if (page < lastPage) {
            if (elementId === 'allowOffersSlides') {
                this.offer.getPremiumList(this.coords.lat, this.coords.lng, this.user.referral_points, this.user.redemption_points, ++this.allowOffersPage, true)
                    .subscribe(resp => {
                        this.allowPremiumOffers = [...this.allowPremiumOffers, ...resp.data];
                        this.allowOffersLastPage = resp.last_page;
                        event.lockSwipeToNext(false);
                        this.isRightArrowVisible = true;
                    });
            }
            else if (elementId === 'offersSlides') {
                this.offer.getPremiumList(this.coords.lat, this.coords.lng, this.MAX_POINTS, this.MAX_POINTS, ++this.offersPage, true)//to do
                    .subscribe(resp => {
                        this.premiumOffers = [...this.premiumOffers, ...resp.data];
                        this.offersLastPage = resp.last_page;
                        event.lockSwipeToNext(false);
                        this.isRightArrowVisible = true;
                    });
            }
        }
        else {
            if (event.length() > 1) {
                if (event.loop === false) {
                    event.loop = true;
                }
                event.lockSwipeToNext(false);
                this.isRightArrowVisible = true;
            }
            else {
                this.isRightArrowVisible = false;
            }
        }
    }

    slideToFirst(event: Slides) {
        event.slideTo(0);
    }

    openPlace(event, data, offer?: Offer) {
        if (this.isClick) {
            let slides = this.allowOffersSlides || this.offersSlides;
            if (slides) {
                this.slideToFirst(slides);
            }
            this.stopTimer();
            this.isClick = false;
        }
        else {
            this.isClick = true;
            this.timer = setTimeout(() => {
                this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'event_chooseplace');
                this.analytics.faLogEvent('event_chooseplace');

                let params = {
                    company: data,
                    distanceObj: this.getDistance(data.latitude, data.longitude),
                    coords: this.coords,
                    user: this.user

                }
                if (offer && offer.redemption_access_code) {
                    let limitationPopover = this.popoverCtrl.create(LimitationPopover, { offer: offer, user: this.user });
                    limitationPopover.present();
                }
                else {
                    if (offer && event && event.target.localName === 'a') {
                        this.openLinkPopover(event);
                    }
                    else {
                        this.nav.push(PlacePage, params);
                    }

                }
                this.isClick = false;
            }, 300);
        }
    }


    openLinkPopover(event) {
        if (this.isDismissLinkPopover) {
            this.isDismissLinkPopover = false;
            let host: string = event.target.host;
            let href: string = event.target.href;
            if (host === 'api.nau.io' || host === 'api-test.nau.io' || host === 'nau.toavalon.com') {
                event.target.href = '#';
                let endpoint = href.split('places')[1];
                this.offer.getLink(endpoint)
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

    openSettings() {
        this.nav.push(SettingsPage, { isAdvMode: false, user: this.user });
    }

    openRewards(user: User) {
        this.nav.push(UserTasksPage, { user: this.user });
    }

    openAchieve(user: User) {
        this.nav.push(UserAchievePage, { user: this.user });
    }

    openUserOffers() {
        this.nav.push(UserOffersPage);
    }

    openUserNau() {
        // if (!this.platform.is('ios')) {
        this.nav.push(UserNauPage, { NAU: this.NAU });
        // }
    }

    openUserUsers() {
        this.nav.push(UserUsersPage);
    }

    openCreateUserProfilePage() {
        this.nav.push(CreateUserProfilePage, { user: this.user });
    }

    dismissLoading() {
        if (this.loadingLocation) {
            this.loadingLocation.dismiss();
            this.loadingLocation = undefined;
        }
    }

    inviteFriend() {
        if (this.user && this.user.invite_code) {
            this.translate.get('SHARING.INVITE')
                .subscribe(translation => {
                    const Branch = window['Branch'];
                    let properties = {
                        canonicalIdentifier: `?invite_code=${this.user.invite_code}`,
                        canonicalUrl: `${this.branchDomain}?invite_code=${this.user.invite_code}`,
                        title: this.user.name,
                        contentImageUrl: this.user.picture_url,
                        // contentDescription: '',
                        // price: 12.12,
                        // currency: 'GBD',
                        contentIndexingMode: 'private',
                        contentMetadata: {
                            invite_code: this.user.invite_code,
                        }
                    };
                    var branchUniversalObj = null;
                    Branch.createBranchUniversalObject(properties)
                        .then(res => {
                            branchUniversalObj = res;
                            let analytics = {};
                            let message = translation;
                            branchUniversalObj.showShareSheet(analytics, properties, message);

                            branchUniversalObj.onLinkShareResponse(res => {
                                this.adjust.setEvent('IN_FR_BUTTON_CLICK_PROFILE_PAGE');
                            });
                            // console.log('Branch create obj error: ' + JSON.stringify(err))
                        })
                })
        }
        else return;
    }

    logout() {
        this.translate.get(['CONFIRM', 'UNIT'])
            .subscribe(resp => {
                let content = resp['CONFIRM'];
                let unit = resp['UNIT'];
                let confirm = this.alert.create({
                    title: content['LOGOUT'],
                    message: content['ARE_YOU_SHURE'],
                    buttons: [
                        {
                            text: unit['CANCEL'],
                            handler: () => {
                            }
                        },
                        {
                            text: unit['OK'],
                            handler: () => {
                                this.auth.logout();
                            }
                        }
                    ]
                });
                confirm.present();
            })
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    ionViewDidLeave() {
        this.stopTimer();
        this.isClick = false;
    }

    ngOnDestroy() {
        this.stopTimer();
        this.onRefreshAccounts.unsubscribe();
        this.onRefreshCoords.unsubscribe();
        this.onRefreshUser.unsubscribe();
        this.onRefreshProfileCoords.unsubscribe();
        this.onRefreshFavoritesOffers.unsubscribe();
        this.onRefreshFavoritesPlaces.unsubscribe();
    }

}
