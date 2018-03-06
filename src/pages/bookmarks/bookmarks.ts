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
    totalCompanies: number;
    totalOffers: number;
    distanceString: string;

    constructor(
        private favorites: FavoritesService,
        private profile: ProfileService,
        private nav: NavController,
        private location: LocationService) {

        this.segment = "places";
        this.favorites.getPlaces(this.companiesPage)
            .subscribe(resp => {
                this.companies = resp.data;
                this.companiesLastPage = resp.last_page;
                this.totalCompanies = resp.total;
            });
        this.favorites.getOffers(this.offersPage)
            .subscribe(resp => {
                this.offers = resp.data;
                this.offersLastPage = resp.last_page;
                this.totalOffers = resp.total;
            })
                let coords = this.location.getCache();
                this.coords = {
                    lat: coords.latitude,
                    lng: coords.longitude
                };
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
        let params = {
            company: data,
            distanceStr: this.getDistance(data.latitude, data.longitude),
            // coords: this.coords,
        }
        this.nav.push(PlacePage, params);
    }
    
    openOffer(offer, company?) {
        // this.nav.push(OfferPage, {
        //     offer: offer,
        //     distanceStr: this.distanceString,
        //     coords: this.coords
        // });
    }

    getTotal() {
        let total = this.segment === 'places'
        ? this.totalCompanies
        : this.totalOffers;
        return total;
    }


}