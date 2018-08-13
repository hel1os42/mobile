import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoadingController, NavController, Platform, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { User } from '../../models/user';
import { AppModeService } from '../../providers/appMode.service';
import { FavoritesService } from '../../providers/favorites.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { TestimonialsService } from '../../providers/testimonials.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { LinkPopover } from '../offer/link.popover';
import { OfferPage } from '../offer/offer';
import { LimitationPopover } from '../place/limitation.popover';
import { PlacePage } from '../place/place';

@Component({
    selector: 'page-bookmarks',
    templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

    segment;
    companies: Place[];
    offers: Offer[];
    coords: Coords;
    offersPage = 1;
    companiesPage = 1;
    offersLastPage: number;
    companiesLastPage: number;
    totalCompanies: number;
    totalOffers: number;
    // distanceObj;
    isForkMode: boolean;
    onRefreshCompanies: Subscription;
    onRefreshOffers: Subscription;
    onRefreshTestimonials: Subscription;
    onRefreshCoords: Subscription;
    onRefreshCompany: Subscription;
    onRefreshUser: Subscription;
    onRefreshProfileCoords: Subscription;
    loadingLocation;
    user: User;
    isDismissLinkPopover = true;

    constructor(
        private favorites: FavoritesService,
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private testimonials: TestimonialsService,
        private platform: Platform,
        private loading: LoadingController,
        private offerService: OfferService,
        private popoverCtrl: PopoverController,
        private profile: ProfileService,
        private browser: InAppBrowser) {

        this.isForkMode = this.appMode.getForkMode();

        this.segment = 'places';
        this.getLocation(true, true);

        this.profile.get(true, false)
            .subscribe(user => this.user = user);

        this.onRefreshCoords = this.location.onRefreshCoords
            .subscribe(coords => this.coords = coords);

        this.onRefreshProfileCoords = this.location.onProfileCoordsChanged
            .subscribe(coords => this.coords = coords);

        this.onRefreshCompanies = this.favorites.onRefreshPlaces
            .subscribe(resp => {
                if (!resp.notRefresh) {
                    this.companiesPage = 1;
                    this.getPlacesList();
                };
            });

        this.onRefreshOffers = this.favorites.onRefreshOffers
            .subscribe(resp => {
                if (!resp.notRefresh) {
                    this.offersPage = 1;
                    this.getOffersList(false);
                };
            });

        this.onRefreshTestimonials = this.testimonials.onRefresh
            .subscribe(resp => {
                if (resp.status === 'approved') {
                    this.companies.forEach(company => {
                        if (company.id === resp.place_id) {
                            // if (company.stars && company.stars > 0 && company.testimonials_count && company.testimonials_count > 0) {
                            //     company.stars = (company.stars * company.testimonials_count + resp.stars) / company.testimonials_count + 1;
                            // }
                            // else {
                            //     company.stars = resp.stars;
                            // }
                            // company.testimonials_count = company.testimonials_count + 1;
                        };
                    });
                }
            });

        this.onRefreshCompany = this.offerService.onRefreshPlace
            .subscribe(data => {
                if (data.offers && data.offers.length > 0) {
                    this.offers.forEach(offer => {
                        data.offers.forEach(refreshedOffer => {

                            if (offer.id === refreshedOffer.id) {
                                offer = _.extend(offer, refreshedOffer);
                            }

                        })
                    });
                }

            });

        this.onRefreshUser = this.profile.onRefresh
            .subscribe(user => this.user = user);

    }

    getPlacesList() {
        this.favorites.getPlaces(this.companiesPage)
            .subscribe(resp => {
                this.companies = resp.data;
                this.companiesLastPage = resp.last_page;
                this.totalCompanies = resp.total;
                this.getSegment();
                this.dismissLoading();
            },
                err => this.dismissLoading()
            );
    }
    getOffersList(isGetSegment: boolean) {
        this.favorites.getOffers(this.offersPage)
            .subscribe(res => {
                this.offers = res.data;
                this.offersLastPage = res.last_page;
                this.totalOffers = res.total;
                this.segment = this.offers && this.offers.length > 0 && this.segment === 'offers'
                    ? 'offers'
                    : 'places';
                if (isGetSegment) {
                    this.getSegment();
                }
                this.dismissLoading();
            },
                err => this.dismissLoading()
            );
    }

    getLists(isPlaces: boolean, isOffers) {
        if (isPlaces) {
            this.getPlacesList();
        }
        if (isOffers) {
            this.getOffersList(isPlaces && isOffers);
        }
    }

    dismissLoading() {
        if (this.loadingLocation) {
            this.loadingLocation.dismiss();
            this.loadingLocation = undefined;
        }
    }

    getDevMode() {
        return (this.appMode.getEnvironmentMode() === 'dev' || this.appMode.getEnvironmentMode() === 'test');
    }

    getSegment() {
        this.segment = this.companies && this.companies.length > 0
            ? 'places'
            : this.offers && this.offers.length > 0
                ? 'offers'
                : 'places';
    }

    getLocation(isPlaces: boolean, isOffers: boolean) {
        if (this.platform.is('cordova')) {
            let promise: Promise<any>;

            if (isPlaces && isOffers) {
                this.loadingLocation = this.loading.create({ content: '' });
                this.loadingLocation.present();
            }

            promise = this.location.getCache();
            promise.then(resp => {
                this.coords = {
                    lat: resp.coords.lat,
                    lng: resp.coords.lng
                };
                this.getLists(isPlaces, isOffers);
            })
        } else {
            this.location.getCache()
                .then(resp => {
                    this.coords = {
                        lat: resp.coords.lat,
                        lng: resp.coords.lng
                    };
                    this.getLists(isPlaces, isOffers);
                })
        }
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
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
        } else {
            return {
                distance: undefined,
                key: undefined
            }
        }

    }

    openPlace(data) {
        let company = _.clone(data);
        company.is_favorite = true;
        let params = {
            company: company,
            coords: this.coords,
            distanceObj: this.getDistance(data.latitude, data.longitude),
            // coords: this.coords,
        }
        this.nav.push(PlacePage, params);
    }

    openOffer(event, offer) {
        if (!offer.redemption_access_code) {

            if (event.target.localName === 'a') {
                this.openLinkPopover(event);
            } else {
                let offerData = _.clone(offer);
                offerData.is_favorite = true;
                this.nav.push(OfferPage, {
                    offer: offerData,
                    distanceObj: this.getDistance(offer.latitude, offer.longitude),
                    coords: this.coords,
                    company: offer.account.owner.place
                });
            }

        } else {
            let limitationPopover = this.popoverCtrl.create(LimitationPopover, { offer: offer, user: this.user });
            limitationPopover.present();
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
                this.offerService.getLink(endpoint)
                    .subscribe(link => {
                        event.target.href = href;
                        let linkPopover = this.popoverCtrl.create(LinkPopover, { link: link });
                        linkPopover.present();
                        linkPopover.onDidDismiss(() => this.isDismissLinkPopover = true);
                    })
            } else {
                this.browser.create(href, '_system');
            }
        }
    }

    getTotal() {
        let total = this.segment === 'places'
            ? this.totalCompanies
            : this.totalOffers;
        return total;
    }

    removePlace(company) {
        this.favorites.removePlace(company.id, false);
        // .subscribe(() => {
        //     this.companies.forEach(item => {
        //         if (item.id === company.id) {
        //             let i = _.indexOf(this.companies, item);
        //             this.companies.splice(i, 1);
        //             this.totalCompanies = this.companies.length;
        //         }
        //     })
        // });
    }

    removeOffer(offer) {
        this.favorites.removeOffer(offer.id, false);
        // .subscribe(() => {
        //     this.offers.forEach(item => {
        //         if (item.id === offer.id) {
        //             let i = _.indexOf(this.offers, item);
        //             this.offers.splice(i, 1);
        //             this.totalOffers = this.offers.length;
        //         }
        //     })
        // });
    }

    isInfiniteScroll() {
        return this.segment === 'places' ? this.companiesPage <= this.companiesLastPage : this.offersPage <= this.offersLastPage;
    }

    infiniteScroll(infiniteScroll) {
        let page: number;
        let lastPage: number;

        if (this.segment === 'places') {
            page = ++this.companiesPage;
            lastPage = this.companiesLastPage;
        } else if (this.segment === 'offers') {
            page = ++this.offersPage;
            lastPage = this.offersLastPage;
        }

        if (page <= lastPage) {
            setTimeout(() => {
                if (this.segment === 'places') {
                    this.favorites.getPlaces(this.companiesPage)
                        .subscribe(resp => {
                            this.companies = [...this.companies, ...resp.data];
                            this.companiesLastPage = resp.last_page;
                            infiniteScroll.complete();
                        },
                        err => infiniteScroll.complete());
                } else if (this.segment === 'offers') {
                    this.favorites.getOffers(this.offersPage)
                        .subscribe(res => {
                            this.offers = [...this.offers, ...res.data];
                            this.offersLastPage = res.last_page;
                            infiniteScroll.complete();
                        },
                        err => infiniteScroll.complete());
                }
            });
        } else {
            infiniteScroll.complete();
        }
    }

    ngOnDestroy() {
        this.onRefreshCompanies.unsubscribe();
        this.onRefreshOffers.unsubscribe();
        this.onRefreshTestimonials.unsubscribe();
        this.onRefreshCompany.unsubscribe();
        this.onRefreshUser.unsubscribe();
        this.onRefreshCoords.unsubscribe();
        this.onRefreshProfileCoords.unsubscribe();
    }


}