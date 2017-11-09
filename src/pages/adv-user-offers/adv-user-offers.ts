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
    page = 1;
    lastPage: number;
    isFilterByDate = false;
    dates;

    constructor(private nav: NavController,
        private place: PlaceService,
        private timezone: TimezoneService) {

        this.place.getOffers(this.page)
            .subscribe(resp => {
                this.offers = resp.data;
                this.total = resp.total;
                this.lastPage = resp.last_page;
            });

        this.segment = 'all';

    }

    filterOffers() {
        this.page = 1;
        this.isFilterByDate = false;
        switch (this.segment) {
            case 'all':
                this.place.getOffers(this.page)
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                        this.lastPage = resp.last_page;
                    });
                break;
            case 'active':
                this.place.getActiveOffers(this.page)
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                        this.lastPage = resp.last_page;
                    });
                break;
            case 'deactive':
                this.place.getDeActiveOffers(this.page)
                    .subscribe(resp => {
                        this.offers = resp.data;
                        this.total = resp.total;
                        this.lastPage = resp.last_page;
                    });
                break;
            case 'featured':
                this.offers = [];//to do
                this.total = 0;//to do
                break;
        }
    }

    filterOffersByDate() {
        this.segment = 'active';
        this.page = 1;
        this.isFilterByDate = true;
        this.dates = DateTimeUtils.getFilterDates(this.date);
        this.place.getFilteredOffersByDate(this.dates.startDate, this.dates.finishDate, this.page)
            .subscribe(resp => {
                this.offers = resp.data;
                this.total = resp.total;
                this.lastPage = resp.last_page;
            })
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

    editStatus(offer) {
        let status = {
            status: (offer.status == 'active')
                ? 'deactive'
                : 'active'
        };
        this.place.changeOfferStatus(status, offer.id)
            .subscribe(resp => {
                if(this.isFilterByDate) {
                    this.filterOffersByDate();
                }
                else {
                    this.filterOffers();
                }
            })
    }

    doInfinite(infiniteScroll) {
        this.page = this.page + 1;
        if (this.page <= this.lastPage) {
            setTimeout(() => {
                let obs;
                if (this.isFilterByDate) {
                    obs = this.place.getFilteredOffersByDate(
                        this.dates.startDate, this.dates.finishDate, this.page);
                }
                else {
                    switch (this.segment) {
                        case 'all':
                            obs = this.place.getOffers(this.page);
                            break;
                        case 'active':
                            obs = this.place.getActiveOffers(this.page);
                            break;
                        case 'deactive':
                            obs = this.place.getDeActiveOffers(this.page);
                            break;
                    }
                }
                obs.subscribe(resp => {
                    for (let i = 0; i < resp.data.length; i++) {
                        this.offers.push(resp.data[i]);
                    }
                    infiniteScroll.complete();
                });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }
}