import { Component } from '@angular/core';
import { DatePeriod } from '../../models/datePeriod';
import { NavController } from 'ionic-angular';
import { Statistic1Page } from '../statistic1/statistic1';

@Component({
    selector: 'page-statistic',
    templateUrl: 'statistic.html'
})
export class StatisticPage {

    segment = 'week';
    activeSegment = 'all';
    isGraphicVisible = false;
    isDateFilterVisible = false;
    periods: DatePeriod[] = [];
    period = new DatePeriod;
    lastPeriod: DatePeriod;
    labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    data = [0, 10, 17, 34, 29, 20, 11];

    constructor(private nav: NavController) {
        this.period = {
            from: {
                day: '',
                time: '',
            },
            to: {
                day: '',
                time: '',
            }
        };
        this.periods.push(this.period);
        this.lastPeriod = this.periods[this.periods.length - 1];
    }

    showGraphic() {
        this.isGraphicVisible = true;
    }

    filterOffers() {
        switch (this.segment) {
            case 'today':
                this.isDateFilterVisible = false;
                this.isGraphicVisible = false;
                break;
            case 'yesterday':
                this.isDateFilterVisible = false;
                this.isGraphicVisible = false;
                break;
            case 'week':
                this.isDateFilterVisible = false;
                this.isGraphicVisible = false;
                break;
            case 'month':
                this.isDateFilterVisible = false;
                this.isGraphicVisible = false;
                break;
            case 'calendar':
                this.isDateFilterVisible = true;
                this.isGraphicVisible = false;
                break;
        }
    }

    addDatePeriod() {
        this.periods.push({
            from: {
                day: '',
                time: '',
            },
            to: {
                day: '',
                time: '',
            }
        });
        this.lastPeriod = this.periods[this.periods.length - 1];
    }

    showPeriodResult() {
        this.nav.push(Statistic1Page);
    }

}
