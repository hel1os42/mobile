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

    static getTimezone(timezone) {
        let timezoneStr = (timezone < 0)
        ? ('-0' + Math.abs(timezone) + '00') 
        : ('+0' + Math.abs(timezone) + '00');
        return timezoneStr;
    }
} 