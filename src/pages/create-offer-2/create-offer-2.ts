import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


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
        // this.offer.start_date = (new Date(this.offer.start_date)).toISOString();
        // let start = moment(this.offer.start_date).add(2, 's').add(100000, 'ms');

        // // this.offer.start_date = moment().format("YYYY-MM-DD "); 
        // // debugger
        // this.offer.finish_date = this.finishDate + " " + this.offer.finish_time; 
        this.offer.start_date = "2017-09-15 16:38:17.000000+0200";//to do
        this.offer.finish_date = "2017-11-15 16:38:17.000000+0200";
        this.offer.start_time = "16:38:17.000000+0200";
        this.offer.finish_time = "16:38:17.000000+0200";
        this.nav.push(CreateOffer3Page, { offer: this.offer });

    }

}
