import { Observable } from "rxjs";
import { Http, Response } from '@angular/http';

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

    public static ZERO_DATETIME_SUFFIX = ' 00:00:00.000000';
    public static ZERO_TIME_SUFFIX = ':00.000000';

    static getTimezone(timezoneData) {
        let timezone = (timezoneData.dstOffset + timezoneData.rawOffset) / 3600;
        return DateTimeUtils.timezoneToStr(timezone);
    }

    static getFilterDates(date: string) {
        let timezone = -1 * (new Date().getTimezoneOffset() / 60);
        let timezoneStr = DateTimeUtils.timezoneToStr(timezone);
        let start = new Date(date).getTime() - (24 * 60 * 60 * 1000);
        let startDate = encodeURIComponent(new Date(start).toISOString().slice(0, 10) + ' 23:59:59.999999' + timezoneStr);
        let finish = new Date(date).getTime() + (24 * 60 * 60 * 1000);
        let finishDate = encodeURIComponent(new Date(finish).toISOString().slice(0, 10) + ' 00:00:00.000000' + timezoneStr);
       return {startDate, finishDate};
    }

    static timezoneToStr(timezone) {
        let timezoneStr = (timezone < 0)
        ? ('-0' + Math.abs(timezone) + '00') 
        : ('+0' + Math.abs(timezone) + '00');
        return timezoneStr;
    }
} 