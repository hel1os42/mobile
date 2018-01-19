import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { Company } from '../../models/company';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { AppModeService } from '../../providers/appMode.service';
import { OfferService } from '../../providers/offer.service';
import { OfferPage } from '../offer/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {
    coords: Coords;
    company = new Company();
    visibleFooter: boolean = false;
    segment: string;
    offersList: Offer[];
    distanceString: string;

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private app: App) {

        this.segment = "alloffers";
        this.coords = this.navParams.get('coords');
        this.company = this.navParams.get('company');
        let companyId = this.company.id;

        this.distanceString = this.navParams.get('distanceStr');

        this.offers.getPlace(companyId)
            .subscribe(companyWithOffers => {
                this.company = companyWithOffers;
                this.offersList = companyWithOffers.offers.filter(p => p.status == 'active');
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

    getStars(star: number){
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    openFeedback(testimonial) {
        this.nav.push(PlaceFeedbackPage, { testimonial: testimonial });
    }

    openOffer(offer, company) {
        //this.nav.setRoot(OfferPage, { offer: offer});
        this.app.getRootNav().push(OfferPage, { 
            offer: offer, 
            company: this.company, 
            distanceStr: this.distanceString,
            coords: this.coords
        });
    }

}
