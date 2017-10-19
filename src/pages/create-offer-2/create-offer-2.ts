import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DateTimeUtils } from '../../utils/date-time.utils';


@Component({
    selector: 'page-create-offer-2',
    templateUrl: 'create-offer-2.html'
})
export class CreateOffer2Page {

    offer: OfferCreate;
    isDetailedSettingsVisible = false;
    todayDate: Date;
    timeFrames = [];
    finishTime: string;
    startTime: string;
    startDate: string;
    finishDate: string;
    picture_url: string;
  

    constructor(private nav: NavController,
        private navParams: NavParams) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        this.todayDate = new Date();
        let days = DateTimeUtils.ALL_DAYS;
            
        for (let i = 0; i < 7; i++) {
            this.timeFrames[i] = {
                from: '',
                to: '',
                days: days[i],
                isSelected: false
            };
        }
    }

    selectStartTime($event) {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.from = this.startTime;
            timeFrame.isSelected = true;
        });
    }

    selectFinishTime($event) {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.to = this.finishTime;
            timeFrame.isSelected = true;
        });
    }

    selectWorkingDays($event) {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.isSelected = (timeFrame.days != DateTimeUtils.ALL_DAYS[5]) && (timeFrame.days !=  DateTimeUtils.ALL_DAYS[6]);
        });
    }

    selectWeekend($event) {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.isSelected = (timeFrame.days ==  DateTimeUtils.ALL_DAYS[5]) || (timeFrame.days ==  DateTimeUtils.ALL_DAYS[6]);
        });
    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;

    }


    openCreateOffer3Page() {
        let timezone = DateTimeUtils.getTimeZoneByCoords(0, 0);
        let dateMask = DateTimeUtils.ZERO_DATETIME_SUFFIX;
        let timeMask = DateTimeUtils.ZERO_TIME_SUFFIX; 
        this.offer.start_date = this.startDate + dateMask + timezone;
        this.offer.finish_date = this.finishDate + dateMask + timezone;

        let selected = this.timeFrames.filter(p => p.isSelected);
        this.offer.timeframes = selected.map(p => {
            return {
                from: p.from + timeMask + timezone,
                to: p.to + timeMask + timezone,
                days: [p.days.slice(0, 2)]
            }
        })
        debugger
        this.nav.push(CreateOffer3Page, { offer: this.offer, picture: this.picture_url });

    }
}
