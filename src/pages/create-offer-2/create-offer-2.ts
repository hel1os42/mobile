import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { TimezoneService } from '../../providers/timezone.service';
import { DateTimeUtils } from '../../utils/date-time.utils';
import { CreateOffer3Page } from '../create-offer-3/create-offer-3';

@Component({
    selector: 'page-create-offer-2',
    templateUrl: 'create-offer-2.html'
})
export class CreateOffer2Page {

    offer: Offer;
    isDetailedSettingsVisible = false;
    todayDate: Date;
    timeFrames = [];
    finishTime: string;
    startTime: string;
    startDate: string;
    finishDate: string;
    picture_url: string;
    isWorkingDays = false;
    isWeekend = false;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private timezone: TimezoneService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        this.todayDate = new Date();
        let days = DateTimeUtils.ALL_DAYS;
        this.startDate = (this.offer.id && this.offer.start_date.date) ? 
        this.offer.start_date.date.slice(0, 10) : this.todayDate.toISOString().slice(0, 10);
        this.finishDate = (this.offer.id && this.offer.finish_date.date) ? 
        this.offer.finish_date.date.slice(0, 10) : this.todayDate.toISOString().slice(0, 10);

        for (let i = 0; i < 7; i++) {
            this.timeFrames[i] = {
                from: '',
                to: '',
                days: days[i],
                isSelected: false
            };
        }
        if (this.offer.id) {
            // let timeframesData = [
                //{ from: "10:00:00.000000+0300", to: "23:00:00.000000+0300", days: ["tu", 'we', 'th', 'fr', "sa", "su"] },
            // ];
            if (this.offer.timeframes) {
                let grouped = DateTimeUtils.groupTimeframes(this.offer.timeframes, this.timeFrames);
                this.startTime = grouped.startTime;
                this.finishTime = grouped.finishTime;
                this.isWorkingDays = grouped.isWorkingDays;
                this.isWeekend = grouped.isWeekend;
                this.timeFrames = grouped.simpleTimeFrames;
                this.isDetailedSettingsVisible = grouped.isDetailedSettingsVisible;
            }

        }
    }

    selectStartTime($event) {
        this.timeFrames.forEach((timeFrame) => {
            if (this.isWeekend || this.isWorkingDays) {
                timeFrame.from = timeFrame.isSelected ? this.startTime : '';
            }
            else {
                timeFrame.from = this.startTime;
                if (timeFrame.to != '') {
                    timeFrame.isSelected = true;
                }
            }
        });
    }
    getTime() {
        if (this.todayDate.getTime() > new Date(this.startDate).getTime()) {
            return true;
        }
        else {
            return false;
        }
    }

    selectFinishTime($event) {
        this.timeFrames.forEach((timeFrame) => {
            if (this.isWeekend || this.isWorkingDays) {
                timeFrame.to = timeFrame.isSelected ? this.finishTime : '';
            }
            else {
                timeFrame.to = this.finishTime;
                if (timeFrame.from != '') {
                    timeFrame.isSelected = true;
                }
            }
        });
    }

    selectWorkingDays() {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.isSelected = (timeFrame.days != DateTimeUtils.SATURDAY) && (timeFrame.days != DateTimeUtils.SUNDAY);
            timeFrame.from = timeFrame.isSelected ? this.startTime : '';
            timeFrame.to = timeFrame.isSelected ? this.finishTime : '';
            this.isWorkingDays = true;
            this.isWeekend = false;
        });
    }

    selectWeekend() {
        this.timeFrames.forEach((timeFrame) => {
            timeFrame.isSelected = (timeFrame.days == DateTimeUtils.SATURDAY) || (timeFrame.days == DateTimeUtils.SUNDAY);
            timeFrame.from = timeFrame.isSelected ? this.startTime : '';
            timeFrame.to = timeFrame.isSelected ? this.finishTime : '';
            this.isWeekend = true;
            this.isWorkingDays = false;
        });
    }

    toggleVisible() {
        this.isDetailedSettingsVisible = !this.isDetailedSettingsVisible;
        // this.checkDays();
    }

    removeTime(event, isSelected) {
        if (isSelected) {
            switch (event) {
                case 'start':
                    this.startTime = DateTimeUtils.getTime(this.timeFrames).startTime;
                    break;
                case 'finish':
                    this.finishTime = DateTimeUtils.getTime(this.timeFrames).finishTime;
                    break;
            }
        }
    }

    checkDays() {
        let day = DateTimeUtils;
        let daysFrame = this.timeFrames.filter(i => i.isSelected).map(j => j.days.slice(0, 2));
        if (daysFrame.length == 2 || daysFrame.length == 5) {
            if (daysFrame.length == 2) {
                this.isWeekend = DateTimeUtils.find(daysFrame, [day.SATURDAY, day.SUNDAY]);
                this.isWorkingDays = false;
            }
            if (daysFrame.length == 5) {
                this.isWorkingDays = DateTimeUtils.find(daysFrame, [day.MONDAY, day.TUESDAY, day.WEDNESDAY, day.THURSDAY, day.FRIDAY]);
                this.isWeekend = false;
            }
        }
        else {
            this.isWeekend = false;
            this.isWorkingDays = false;
        }

        this.startTime = DateTimeUtils.getTime(this.timeFrames).startTime;
        this.finishTime = DateTimeUtils.getTime(this.timeFrames).finishTime;

        // this.timeFrames.forEach((timeFrame) => {
        //     if (!timeFrame.isSelected) {
        //         timeFrame.from = '';
        //         timeFrame.to = '';
        //     }
        // });
    }

    isDisabled () {
        let disabled;
        let selected = this.timeFrames.filter(p => p.from != '' && p.from && p.to && p.to != '' && p.isSelected);
        disabled = (selected.length == 0 || !this.startDate || !this.finishDate) ? true : false;
        return disabled;
    }

    openCreateOffer3Page() {
        let timezone: number;
        let timezoneStr: string;
        this.timezone.get(this.offer.latitude, this.offer.longitude, Math.round(this.todayDate.valueOf() / 1000))
            .subscribe(resp => {
                timezoneStr = DateTimeUtils.getTimezone(resp);
                let startDateMask = DateTimeUtils.ZERO_START_DATETIME_SUFFIX;
                let finishDateMask = DateTimeUtils.ZERO_FINISH_DATETIME_SUFFIX;
                let timeMask = DateTimeUtils.ZERO_TIME_SUFFIX;
                    this.offer.start_date = this.startDate + startDateMask + timezoneStr;
                    this.offer.finish_date = this.finishDate + finishDateMask + timezoneStr;
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
