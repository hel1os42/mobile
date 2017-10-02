import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'page-create-offer-2',
    templateUrl: 'create-offer-2.html'
})
export class CreateOffer2Page {

    offer = new OfferCreate;
    isDetailedSettingsVisible: boolean = false;
    startDate: string;
    finishDate: string;
    startTime: string;
    finishTime: string;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');

    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;

    }

    openCreateOffer3Page() {
        this.offer.start_date = this.startDate + " " + this.offer.start_time;
        this.offer.start_date = (new Date(this.offer.start_date)).toISOString();
        this.offer.finish_date = this.finishDate + " " + this.offer.finish_time; 
        debugger;
        this.nav.push(CreateOffer3Page, { offer: this.offer });
       
    }

}
