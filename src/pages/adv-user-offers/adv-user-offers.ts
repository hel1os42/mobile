import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreateOfferPage } from '../create-offer/create-offer';
import { PlaceService } from '../../providers/place.service';
import { Offer } from '../../models/offer';
import { TimezoneService } from '../../providers/timezone.service';
import { DateTimeUtils } from '../../utils/date-time.utils';

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
        private place: PlaceService,
        private timezone: TimezoneService) {

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

    filterByDate() {
        let dates = DateTimeUtils.getFilterDates(this.date);
        this.place.getFilteredOffersByDate(dates.startDate, dates.finishDate)
            .subscribe(resp => {
                this.offers = resp.data;
                this.total = resp.total;
                debugger
            })
        debugger
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