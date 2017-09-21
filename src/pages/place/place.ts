import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';
import { Company } from '../../models/company';
import { Offer } from '../../models/offer';
import { PlaceFeedbackPage } from '../place-feedback/place-feedback';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {
    company = new Company();
    offersList: Offer[];
    segment;
    visibleFooter: boolean = false;

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams) {
        
            this.segment = "alloffers"   
    }

    ionViewDidLoad() {
        let companyId = this.navParams.get('companyId');
        this.offers.getCompany(companyId)
            .subscribe(company => {
                this.company = company;
                this.offersList = company.offers;})

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

    openFeedback() {
        this.nav.push(PlaceFeedbackPage);
    }
}