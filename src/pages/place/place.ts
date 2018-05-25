import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController, NavParams, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { Speciality } from '../../models/speciality';
import { Testimonial } from '../../models/testimonial';
import { AppModeService } from '../../providers/appMode.service';
import { FavoritesService } from '../../providers/favorites.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { TestimonialsService } from '../../providers/testimonials.service';
import { ToastService } from '../../providers/toast.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { OfferPage } from '../offer/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';
import { ComplaintPopover } from './complaint.popover';
import { TestimonialPopover } from './testimonial.popover';

declare var window;

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {
    coords: Coords;
    company = new Place();
    visibleFooter: boolean = false;
    segment: string;
    offersList: Offer[];
    distanceObj;
    features: Speciality[];
    branchDomain = 'https://nau.app.link';
    page: string;
    testimonialsPage = 1;
    testimonialsLastPage: number;
    onRefreshCompany: Subscription;
    onRefreshTestimonials: Subscription;
    envName: string;//temporary
    companyTestimonials: Testimonial[];

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams,
        private profile: ProfileService,
        private share: ShareService,
        private favorites: FavoritesService,
        private toast: ToastService,
        private alert: AlertController,
        private testimonials: TestimonialsService,
        private statusBar: StatusBar,
        private analytics: GoogleAnalytics,
        private translate: TranslateService,
        private launchNavigator: LaunchNavigator,
        private browser: InAppBrowser,
        private popoverCtrl: PopoverController,
        private appMode: AppModeService) {

        this.envName = this.appMode.getEnvironmentMode();//temporary
        this.segment = "alloffers";
        this.coords = this.navParams.get('coords');
        if (this.navParams.get('company')) {
            this.company = this.navParams.get('company');
            this.offersList = this.company.offers;
            this.distanceObj = this.navParams.get('distanceObj');
            this.offers.getPlace(this.company.id)
                .subscribe(company => {
                    this.company = company;
                    this.offersList = company.offers;
                    // this.features = this.company.specialities;
                    this.features = _.uniqBy(company.specialities, 'slug');
                    this.getTestimonials();
                });
        }
        else {
            let companyId = this.navParams.get('placeId');
            this.page = this.navParams.get('page');
            let offerId = this.navParams.get('offerId');
            this.offers.getPlace(companyId)
                .subscribe(company => {
                    this.company = company;
                    this.offersList = company.offers;
                    this.distanceObj = this.getDistance(this.company.latitude, this.company.longitude);
                    // this.features = this.company.specialities;
                    this.features = _.uniqBy(company.specialities, 'slug');
                    if (!offerId) {
                        this.share.remove();
                        this.getTestimonials();
                    }
                    else if (offerId) {
                        let offer = company.offers.filter(offer => offer.id === offerId);
                        this.openOffer(offer[0], company);
                    }
                })
        }

        this.onRefreshCompany = this.favorites.onRefreshOffers
            .subscribe((resp) => {
                this.offersList.forEach(offer => {
                    if (offer.id === resp.id) {
                        offer.is_favorite = resp.isFavorite;
                    }
                });
            });

        this.onRefreshTestimonials = this.testimonials.onRefresh
            .subscribe(resp => {
                if (resp.status === 'approved') {
                    // if (this.company.stars && this.company.stars > 0 && this.company.testimonials_count && this.company.testimonials_count > 0) {
                    //     this.company.stars = (this.company.stars * this.company.testimonials_count + resp.stars) / this.company.testimonials_count + 1;
                    // }
                    // else {
                    //     this.company.stars = resp.stars;
                    // }
                    // this.company.testimonials_count = this.company.testimonials_count + 1;
                }
            });
    }

    // ionSelected() {
    //     this.appMode.setHomeMode(false);
    // }

    ionViewDidLoad() {
        this.statusBar.styleLightContent();
    }

    getTestimonials() {
        this.testimonials.get(this.company.id, this.testimonialsPage)
            .subscribe(testimonials => {
                this.companyTestimonials = testimonials.data;
                this.testimonialsLastPage = testimonials.last_page;
            })
    }

    openFeedback(testimonial) {
        this.nav.push(PlaceFeedbackPage, { testimonial: testimonial });
    }

    getDistance(latitude: number, longitude: number) {
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

    sharePlace() {
        const Branch = window['Branch'];
        this.profile.get(false)
            .subscribe(profile => {
                let properties = {
                    canonicalIdentifier: `?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}`,
                    canonicalUrl: `${this.branchDomain}/?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}`,
                    title: this.company.name,
                    contentDescription: this.company.description,
                    contentImageUrl: this.company.cover_url + '?size=mobile',
                    // price: 12.12,
                    // currency: 'GBD',
                    contentIndexingMode: 'private',
                    contentMetadata: {
                        page: 'place',
                        invite_code: profile.invite_code,
                        placeId: this.company.id,
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
                    })
                    .catch(function (err) {
                        console.log('Branch create obj error: ' + JSON.stringify(err))
                    })

            })
    }

    openOffer(offer, company?) {
        this.analytics.trackEvent("Session", 'event_chooseoffer');
        this.nav.push(OfferPage, {
            offer: offer,
            company: this.company,
            distanceObj: this.getDistance(offer.latitude, offer.longitude),
            coords: this.coords
        });
    }

    removeFavorite() {
        this.favorites.removePlace(this.company.id)
            .subscribe(() => this.company.is_favorite = false);
    }

    addFavorite() {
        this.favorites.setPlace(this.company.id)
            .subscribe(() => {
                this.company.is_favorite = true;
                this.toast.showNotification('TOAST.ADDED_TO_FAVORITES');
            });
    }

    navigate() {
        // if (this.company.latitude) {
        // this.launchNavigator.navigate([this.company.latitude, this.company.longitude]);
        this.launchNavigator.navigate(this.company.address);
        // }
    }

    dial() {
        window.location = 'tel:' + this.company.phone;
    }

    openSite() {
        this.browser.create(this.company.site, '_system');
    }

    openComplaint() {
        let complaintPopover = this.popoverCtrl.create(ComplaintPopover, { companyId: this.company.id });
        complaintPopover.present();
    }

    setTestimonial() {
        let testimonialPopover = this.popoverCtrl.create(TestimonialPopover, { companyId: this.company.id });
        testimonialPopover.present();
        testimonialPopover.onDidDismiss(data => {
            if (data && data.isAdded) {
                this.toast.showNotification('TOAST.ADDED_TO_TESTIMONIALS');
            }
        })
    }

    presentConfirm() {
        this.translate.get(['CONFIRM.REMOVE_FAVORITE_PLACE', 'UNIT'])
            .subscribe(resp => {
                let unit = resp['UNIT'];
                let title = resp['CONFIRM.REMOVE_FAVORITE_PLACE'];
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
            });
    }

    doInfinite(infiniteScroll) {
        this.testimonialsPage = this.testimonialsPage + 1;
        if (this.testimonialsPage <= this.testimonialsLastPage) {
            setTimeout(() => {
                this.testimonials.get(this.company.id, this.testimonialsPage)
                    .subscribe(testimonials => {
                        this.companyTestimonials = [...this.companyTestimonials, ...testimonials.data];
                        infiniteScroll.complete();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }

    ngOnDestroy() {
        this.onRefreshCompany.unsubscribe();
        this.onRefreshTestimonials.unsubscribe();
        //
        let nav: any = this.nav;
        let root = nav.root;
        if (root === BookmarksPage) {
            this.statusBar.styleDefault();
        }
    }

}
