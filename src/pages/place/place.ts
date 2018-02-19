import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { Speciality } from '../../models/speciality';
import { OfferService } from '../../providers/offer.service';
import { OfferPage } from '../offer/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';
import { ProfileService } from '../../providers/profile.service';

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

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams,
        private profile: ProfileService) {

        this.segment = "alloffers";
        this.coords = this.navParams.get('coords');
        this.company = this.navParams.get('company');
        this.features = this.navParams.get('features');
        let companyId = this.company.id;

        this.distanceString = this.navParams.get('distanceStr');

        this.offers.getPlace(companyId)
            .subscribe(company => {
                this.company = company;
                this.offersList = company.offers;
            });

        // this.location.get()
        //     .then((resp) => {
        //         this.coords = {
        //             lat: resp.coords.latitude,
        //             lng: resp.coords.longitude
        //         };
        //     });
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

    share() {
        const Branch = window['Branch'];
        let link: string;
        this.profile.get(false)
            .subscribe(profile => {
                link = `${this.branchDomain}/?invite_code=${profile.invite_code}&page=place&id=${this.company.id}`;
                let properties = {
                    canonicalIdentifier: `?invite_code=${profile.invite_code}&page=place&id=${this.company.id}`,
                    canonicalUrl: link,
                    title: this.company.name,
                    contentDescription: this.company.description,
                    contentImageUrl: this.company.cover_url,
                    // price: 12.12,
                    // currency: 'GBD',
                    contentIndexingMode: 'private',
                    contentMetadata: {
                        page: 'place',
                        invite_code: profile.invite_code,
                        id: this.company.id
                    }
                };
                var branchUniversalObj = null;
                Branch.createBranchUniversalObject(properties)
                    .then(res => {
                        branchUniversalObj = res;
                        let analytics = {};
                        let message = this.company.name + this.company.description
                        branchUniversalObj.showShareSheet(analytics, properties, message)
                            .then(resp => console.log(resp))
                        alert('Response: ' + JSON.stringify(res))
                    }).catch(function (err) {
                        alert('Error: ' + JSON.stringify(err))
                    })

            })
    }

    openOffer(offer, company) {
        //this.nav.setRoot(OfferPage, { offer: offer});
        this.nav.push(OfferPage, {
            offer: offer,
            company: this.company,
            distanceStr: this.distanceString,
            coords: this.coords
        });
    }

}
