import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';
import { Company } from '../../models/company';
import { Offer } from '../../models/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';
import { OfferPage } from '../offer/offer';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {
    company = new Company();
    visibleFooter: boolean = false;
    segment: string;
    offersList: Offer[];

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private app: App) {

        this.segment = "alloffers";

        this.company = this.navParams.get('company');
        let companyId = this.company.id;

        this.offers.getPlace(companyId)
            .subscribe(companyWithOffers => {
                this.company = companyWithOffers;
                this.offersList = companyWithOffers.offers;
            })         
    }

    ionSelected() {
        this.appMode.setHomeMode(false);
    }

    getStars(star: number){
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {
        return 200;
    }

    openFeedback(testimonial) {
        this.nav.push(PlaceFeedbackPage, { testimonial: testimonial });
    }

    openOffer(offer, company) {
        //this.nav.setRoot(OfferPage, { offer: offer});
        this.app.getRootNav().push(OfferPage, { offer: offer, company: this.company});
    }

}
