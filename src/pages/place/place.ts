import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { Speciality } from '../../models/speciality';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { DistanceUtils } from '../../utils/distanse.utils';
import { OfferPage } from '../offer/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';
import { FavoritesService } from '../../providers/favorites.service';
import { Subscription } from 'rxjs';

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
    distanceString: string;
    features: Speciality[];
    branchDomain = 'https://nau.app.link';
    page: string;
    onRefreshCompany: Subscription;

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams,
        private profile: ProfileService,
        private share: ShareService,
        private favorites: FavoritesService) {

        this.segment = "alloffers";
        this.coords = this.navParams.get('coords');
        if (this.navParams.get('company')) {
            this.company = this.navParams.get('company');
            this.features = this.company.specialities;
            this.distanceString = this.navParams.get('distanceStr');
            this.offers.getPlace(this.company.id)
                .subscribe(company => {
                    this.company = company;
                    this.offersList = company.offers;
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
                    this.distanceString = this.getDistance(this.company.latitude, this.company.longitude);
                    this.features = this.company.specialities;
                    if (!offerId) {
                        this.share.remove();
                    }
                    else if (offerId) {
                        let offer = company.offers.filter(offer => offer.id === offerId);
                        this.openOffer(offer[0], company);
                    }
                })
        }

        this.onRefreshCompany = this.favorites.onRefreshOffers
            .subscribe(() => {
                this.offers.getPlace(this.company.id)
                    .subscribe(company => {
                        this.company = company;
                        this.offersList = company.offers;
                    });
            })
    }

    // ionSelected() {
    //     this.appMode.setHomeMode(false);
    // }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    openFeedback(testimonial) {
        this.nav.push(PlaceFeedbackPage, { testimonial: testimonial });
    }

    getDistance(latitude: number, longitude: number) {
        if (this.coords) {
            let distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, latitude, longitude);
            this.distanceString = distance >= 1000 ? distance / 1000 + " km" : distance + " m";
            return this.distanceString;
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
                    }).catch(function (err) {
                        console.log('Branch create obj error: ' + JSON.stringify(err))
                    })

            })
    }

    openOffer(offer, company?) {
        this.nav.push(OfferPage, {
            offer: offer,
            company: this.company,
            distanceStr: this.distanceString,
            coords: this.coords
        });
    }

    removeFavorite() {
        this.favorites.removePlace(this.company.id)
            .subscribe(() => this.company.is_favorite = false);
    }

    addFavorite() {
        this.favorites.setPlace(this.company.id)
            .subscribe(() => this.company.is_favorite = true);
    }

    ionViewDidLeave() {
        this.onRefreshCompany.unsubscribe();
    }

}
