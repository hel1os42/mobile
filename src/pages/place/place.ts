import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';
import { Company } from '../../models/company';
import { Offer } from '../../models/offer';

@Component({
    selector: 'page-place',
    templateUrl: 'place.html'
})
export class PlacePage {
    company = new Company();
    offersList: Offer[];

    constructor(
        private nav: NavController,
        private offers: OfferService,
        private navParams: NavParams) {

    }

    ionViewDidLoad() {
        let companyId = this.navParams.get('companyId');
        this.offers.getCompany(companyId)
            .subscribe(company => this.company = company);
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
}