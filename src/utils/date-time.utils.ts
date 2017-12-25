import * as _ from 'lodash';
import { TimeFrames } from '../models/timeFrames';

export class DateTimeUtils {
    public static MONDAY = 'monday';
    public static TUESDAY = 'tuesday';
    public static WEDNESDAY = 'wednesday';
    public static THURSDAY = 'thursday';
    public static FRIDAY = 'friday';
    public static SATURDAY = 'saturday';
    public static SUNDAY = 'sunday';

    public static ALL_DAYS = [
        DateTimeUtils.MONDAY,
        DateTimeUtils.TUESDAY,
        DateTimeUtils.WEDNESDAY,
        DateTimeUtils.THURSDAY,
        DateTimeUtils.FRIDAY,
        DateTimeUtils.SATURDAY,
        DateTimeUtils.SUNDAY
    ];
    public static ZERO_TIME_SUFFIX = ':00.000000';
    public static ZERO_START_DATETIME_SUFFIX = ' 00:00:00.000000';
    public static ZERO_FINISH_DATETIME_SUFFIX = ' 23:59:59.999999'; 

    static getTimezone(timezoneData) {
        let timezone = (timezoneData.dstOffset + timezoneData.rawOffset) / 3600;
        return DateTimeUtils.timezoneToStr(timezone);
    }

    static getFilterDates(date: string) {
        let timezone = -1 * (new Date().getTimezoneOffset() / 60);
        let timezoneStr = DateTimeUtils.timezoneToStr(timezone);
        let start = new Date(date).getTime() - (24 * 60 * 60 * 1000);
        //let startDate = encodeURIComponent(new Date(start).toISOString().slice(0, 10) + ' 23:59:59.999999' + timezoneStr);
        let startDate = new Date(start).toISOString().slice(0, 10) + ' 23:59:59.999999' + timezoneStr;
        let finish = new Date(date).getTime() + (24 * 60 * 60 * 1000);
        //let finishDate = encodeURIComponent(new Date(finish).toISOString().slice(0, 10) + ' 00:00:00.000000' + timezoneStr);
        let finishDate = new Date(finish).toISOString().slice(0, 10) + ' 00:00:00.000000' + timezoneStr;
        return { startDate, finishDate };
    }

    static timezoneToStr(timezone) {
        let timezoneStr = (timezone < 0)
            ? ('-0' + Math.abs(timezone) + '00')
            : ('+0' + Math.abs(timezone) + '00');
        return timezoneStr;
    }

    static groupTimeframes(timeframesData: TimeFrames[], simpleTimeFrames) {
        let startTime: string;
        let finishTime: string;
        let isWorkingDays = false;
        let isWeekend = false;
        let isDetailedSettingsVisible = timeframesData.length == 0 ? false : true;
        let timeFrames = _.flatMap(timeframesData, function (obj) {
            return _.map(obj.days, function (day) {
                return {
                    from: obj.from,
                    to: obj.to,
                    days: day
                };
            });
        });
        let group = _.groupBy(timeFrames, timeFrame => [timeFrame.from, timeFrame.to]);
        let key = Object.keys(group)[0];
        let arr = group[key];
        if (Object.keys(group).length == 1) {
            startTime = arr[0].from;
            finishTime = arr[0].to;
            isDetailedSettingsVisible = false;
            let days = arr.map(i => i.days);

            if (arr.length == 2 && DateTimeUtils.find(days, [this.SATURDAY, this.SUNDAY])) {
                isWeekend = true;
            }
            if (arr.length == 5 && DateTimeUtils.find(days, [this.MONDAY, this.TUESDAY, this.WEDNESDAY, this.THURSDAY, this.FRIDAY])) {
                isWorkingDays = true;
            }
        }

        for (let i = 0; i < simpleTimeFrames.length; i++) {
            for (let j = 0; j < timeFrames.length; j++) {
                let sTF = simpleTimeFrames;
                let tF = timeFrames;
                sTF[i].isSelected = sTF[i].days.slice(0, 2) == tF[j].days;
                sTF[i].from = (sTF[i].days.slice(0, 2) == tF[j].days) ? tF[j].from.slice(0, 5) : '';
                sTF[i].to = (sTF[i].days.slice(0, 2) == tF[j].days) ? tF[j].to.slice(0, 5) : '';
                if (sTF[i].isSelected) {
                    break;
                }
            }
        }
        return {
            startTime: startTime ? startTime.slice(0, 5) : undefined,
            finishTime: finishTime ? finishTime.slice(0, 5) : undefined,
            isWeekend: isWeekend,
            isWorkingDays: isWorkingDays,
            simpleTimeFrames: simpleTimeFrames,
            isDetailedSettingsVisible: isDetailedSettingsVisible
        }
    }

    static find(daysOfFrames, constDays) {
        let days = constDays.map(i => i.slice(0, 2));
        return _.difference(daysOfFrames, days).length === 0;
    }

    static getTime(timeframes: any[]) {
        timeframes = timeframes.filter(i => i.isSelected);
        let groupedStart = _.values(_.groupBy(timeframes, timeFrame => timeFrame.from));
        let startFrame = groupedStart[0];
        let startTime = groupedStart.length == 1 ? startFrame[0].from : '';
        let groupedFinish = _.values(_.groupBy(timeframes, timeFrame => timeFrame.to));
        let finishFrame = groupedFinish[0];
        let finishTime = groupedFinish.length == 1 ? finishFrame[0].to : '';
        return {
            startTime: startTime,
            finishTime: finishTime
        }
    }

}
