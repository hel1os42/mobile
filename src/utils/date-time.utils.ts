export class DateTimeUtils {

    public static ALL_DAYS = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];

    public static ZERO_DATETIME_SUFFIX = ' 00:00:00.000000';
    public static ZERO_TIME_SUFFIX = ':00.000000';

    public static getTimeZoneByCoords(lat: number, lng: number) {
        return '+0200';
    }
}