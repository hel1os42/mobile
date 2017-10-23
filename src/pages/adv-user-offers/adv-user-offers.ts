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

    constructor(private nav: NavController,
                private place: PlaceService) {

        this.place.getOffers()
            .subscribe(resp => {
                this.offers = resp.data;
                this.total = resp.total;
            });

        this.segment = "all";

    }

    openCreateOffer(offer) {
        this.nav.push(CreateOfferPage, {offer: offer});
    }
}