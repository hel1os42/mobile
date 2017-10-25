import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreateOfferPage } from '../create-offer/create-offer';
import { PlaceService } from '../../providers/place.service';
import { Offer } from '../../models/offer';

@Component({
    selector: 'page-adv-user-offers',
    templateUrl: 'adv-user-offers.html'
})
export class AdvUserOffersPage {

    segment: string;
    offers: Offer[];
    total: number;
    date: string;

    constructor(private nav: NavController,
        private place: PlaceService) {

        this.place.getOffers()
            .subscribe(resp => {
                this.offers = resp.data;
                this.total = resp.total;
            });

        this.segment = 'all';

    }

    segmentChanged($event) {
    
        switch ($event.value) {
            case 'all':
                this.place.getOffers()
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                    });
                break;
            case 'featured':
                this.offers = [];//to do
                this.total = 0;//to do
                break;
            case 'active':
                this.place.getActiveOffers()
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                    });
                break;
            case 'deactive':
                this.place.getDeActiveOffers()
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                    });
                break;
        }
        
    }

    openCreateOffer() {
        this.nav.push(CreateOfferPage);
    }

    openEditOffer(offer) {
        this.place.getOffer(offer.id)
            .subscribe(resp => {
                this.nav.push(CreateOfferPage, { offer: resp });
            })
    }
}