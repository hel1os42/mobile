import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DateTimeUtils } from '../../utils/date-time.utils';
import { TimezoneService } from '../../providers/timezone.service';
import { Offer } from '../../models/offer';
import { OfferDate } from '../../models/OfferDate';


@Component({
    selector: 'page-create-offer-2',
    templateUrl: 'create-offer-2.html'
})
export class CreateOffer2Page {

    offer: Offer;
    isDetailedSettingsVisible: boolean;
    todayDate: Date;
    timeFrames = [];
    finishTime: string;
    startTime: string;
    startDate: string;
    finishDate: string;
    picture_url: string;


    constructor(private nav: NavController,
        private navParams: NavParams,
        private timezone: TimezoneService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        this.isDetailedSettingsVisible = this.offer.id ? true : false;
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
        if (this.offer.id) {
            this.startDate = this.offer.start_date.date.slice(0, 10);
            this.finishDate = this.offer.finish_date.date.slice(0, 10);
            // let timeframesData = [
            //     {from: "10:00:00.000000+0300", to: "23:00:00.000000+0300", days: ["mo"]},
            //     ];
            if (this.offer.timeframes.length) {
                let timeFrames = _.flatMap(this.offer.timeframes, function (obj) {
                    return _.map(obj.days, function (day) {
                        return {
                            from: obj.from,
                            to: obj.to,
                            days: day
                        };
                    });
                });

                for (let i = 0; i < this.timeFrames.length; i ++) {
                    for (let j = 0; j < timeFrames.length; j ++) {
                        let tTF = this.timeFrames[i];
                        let tF = timeFrames[j];
                        tTF.isSelected = tTF.days.slice(0, 2) == tF.days;
                        tTF.from = (tTF.days.slice(0, 2) == tF.days) ? tF.from.slice(0, 5) : '';
                        tTF.to = (tTF.days.slice(0, 2) == tF.days) ? tF.to.slice(0, 5) : '';
                        if (tTF.isSelected) {
                            break;
                        }
                    }
                }
            }
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
            timeFrame.isSelected = (timeFrame.days != DateTimeUtils.SATURDAY) && (timeFrame.days != DateTimeUtils.SUNDAY);
        });
    }

    selectWeekend($event) {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.isSelected = (timeFrame.days == DateTimeUtils.SATURDAY) || (timeFrame.days == DateTimeUtils.SUNDAY);
        });
    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;

    }

    openCreateOffer3Page() {
        let timezone: number;
        let timezoneStr: string;
        this.timezone.get(this.offer.latitude, this.offer.longitude, Math.round(this.todayDate.valueOf() / 1000))
            .subscribe(resp => {
                timezone = (resp.dstOffset + resp.rawOffset) / 3600;
                timezoneStr = DateTimeUtils.getTimezone(timezone);
                let dateMask = DateTimeUtils.ZERO_DATETIME_SUFFIX;
                let timeMask = DateTimeUtils.ZERO_TIME_SUFFIX;
                if (this.offer.id) {
                    this.offer.start_date.date = this.startDate + dateMask + timezoneStr;
                    this.offer.finish_date.date = this.finishDate + dateMask + timezoneStr;
                }
                else {
                    this.offer.start_date = this.startDate + dateMask + timezoneStr;
                    this.offer.finish_date = this.finishDate + dateMask + timezoneStr;
                }
                
                let selected = this.timeFrames.filter(p => p.isSelected);
                this.offer.timeframes = selected.map(p => {
                    return {
                        from: p.from + timeMask + timezoneStr,
                        to: p.to + timeMask + timezoneStr,
                        days: [p.days.slice(0, 2)]
                    }
                })
                this.nav.push(CreateOffer3Page, { offer: this.offer, picture: this.picture_url });
            });
    }
}
