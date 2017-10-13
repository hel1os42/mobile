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
    todayDate: Date;

    constructor(private nav: NavController,
                private navParams: NavParams) {

        this.offer = this.navParams.get('offer');
        this.todayDate = new Date();

    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;

    }

    openCreateOffer3Page() {
        this.offer.start_date = this.offer.start_date + " " + this.offer.start_time;
        this.offer.start_date = moment(this.offer.start_date).format('YYYY-MM-DD HH:mm:ss.SSSSSSZZ');// to do (timezone from place)
        this.offer.start_time = moment(this.offer.start_date).format('HH:mm:ss.SSSSSSZZ');
        this.offer.finish_date = this.offer.finish_date + " " + this.offer.finish_time;
        this.offer.finish_date = moment(this.offer.finish_date).format('YYYY-MM-DD HH:mm:ss.SSSSSSZZ');// to do (timezone from place)
        this.offer.finish_time = moment(this.offer.finish_date).format('HH:mm:ss.SSSSSSZZ')
        this.nav.push(CreateOffer3Page, { offer: this.offer });

    }
}
