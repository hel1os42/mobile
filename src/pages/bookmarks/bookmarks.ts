import { Component } from '@angular/core';
import { Place } from '../../models/place';
import { Offer } from '../../models/offer';
import { Coords } from '../../models/coords';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../providers/favorites.service';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';
import { DistanceUtils } from '../../utils/distanse.utils';
import { NavController } from 'ionic-angular';
import { PlacePage } from '../place/place';
import { LocationService } from '../../providers/location.service';
import { OfferPage } from '../offer/offer';
import * as _ from 'lodash';
import { AppModeService } from '../../providers/appMode.service';
import { TestimonialsService } from '../../providers/testimonials.service';

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
    onRefreshCompanies: Subscription;
    onRefreshOffers: Subscription;
    onRefreshTestimonials: Subscription;
    totalCompanies: number;
    totalOffers: number;
    distanceString: string;
    isForkMode: boolean;

    constructor(
        private favorites: FavoritesService,
        private profile: ProfileService,
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private testimonials: TestimonialsService) {

        this.isForkMode = this.appMode.getForkMode();

        this.segment = "places";
        this.location.getCache()
            .then(resp => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };

                this.favorites.getPlaces(this.companiesPage)
                    .subscribe(resp => {
                        this.companies = resp.data;
                        this.companiesLastPage = resp.last_page;
                        this.totalCompanies = resp.total;
                        this.getSegment();
                    });
                this.favorites.getOffers(this.offersPage)
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.offersLastPage = resp.last_page;
                        this.totalOffers = resp.total;
                        this.getSegment();
                    });
            });

        this.onRefreshCompanies = this.favorites.onRefreshPlaces
            .subscribe(resp => {
                if (!resp.notRefresh) {
                    this.getLocation();
                    this.favorites.getPlaces(this.companiesPage)
                        .subscribe(resp => {
                            this.companies = resp.data;
                            this.companiesLastPage = resp.last_page;
                            this.totalCompanies = resp.total;
                            this.segment = this.companies && this.companies.length > 0 && this.segment === 'places'
                                ? 'places'
                                : this.offers && this.offers.length > 0
                                    ? 'offers'
                                    : 'places';
                        });
                };
            });

        this.onRefreshOffers = this.favorites.onRefreshOffers
            .subscribe(resp => {
                if (!resp.notRefresh) {
                    this.getLocation();
                    this.favorites.getOffers(this.offersPage)
                        .subscribe(resp => {
                            this.offers = resp.data;
                            this.offersLastPage = resp.last_page;
                            this.totalOffers = resp.total;
                            this.segment = this.offers && this.offers.length > 0 && this.segment === 'offers'
                                ? 'offers'
                                : 'places';
                        });
                };
            });

        this.onRefreshTestimonials = this.testimonials.onRefresh
            .subscribe(resp => {
                this.companies.forEach(company => {
                    if (company.id === resp.place_id) {
                        company.testimonials_count += company.testimonials_count;
                        company.stars = resp.stars;
                    };
                });
            });
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

    getLocation() {
        this.location.getCache()
            .then(resp => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
            });
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
            let distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, latitude, longitude);
            this.distanceString = distance >= 1000 ? distance / 1000 + " km" : distance + " m";
            return this.distanceString;
        };
        return undefined;
    }

    openPlace(data) {
        let company = _.clone(data);
        company.is_favorite = true;
        let params = {
            company: company,
            coords: this.coords,
            distanceStr: this.getDistance(data.latitude, data.longitude),
            // coords: this.coords,
        }
        this.nav.push(PlacePage, params);
    }

    openOffer(offer) {
        let offerData = _.clone(offer);
        offerData.is_favorite = true;
        this.nav.push(OfferPage, {
            offer: offerData,
            distanceStr: this.getDistance(offer.latitude, offer.longitude),
            coords: this.coords,
            company: offer.account.owner.place
        });
    }

    getTotal() {
        let total = this.segment === 'places'
            ? this.totalCompanies
            : this.totalOffers;
        return total;
    }

    removePlace(company) {
        this.favorites.removePlace(company.id, true)
            .subscribe(() => {
                this.companies.forEach(item => {
                    if (item.id === company.id) {
                        let i = _.indexOf(this.companies, item);
                        this.companies.splice(i, 1);
                        this.totalCompanies = this.companies.length;
                    }
                })
            });
    }

    removeOffer(offer) {
        this.favorites.removeOffer(offer.id, true)
            .subscribe(() => {
                this.offers.forEach(item => {
                    if (item.id === offer.id) {
                        let i = _.indexOf(this.offers, item);
                        this.offers.splice(i, 1);
                        this.totalOffers = this.offers.length;
                    }
                })
            });
    }

    ngOnDestroy() {
        this.onRefreshCompanies.unsubscribe();
        this.onRefreshOffers.unsubscribe();
    }


}