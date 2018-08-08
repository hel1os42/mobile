import { Injectable } from '@angular/core';
import { FlurryAnalyticsOptions, FlurryAnalyticsObject, FlurryAnalytics } from '@ionic-native/flurry-analytics';
import { Platform } from 'ionic-angular/umd';

@Injectable()
export class FlurryAnalyticsService {

    fa: FlurryAnalyticsObject;
    FLURRY_ANDROID_APP_KEY = 'WGQND43HCBMFK3Y4Y7X4';
    FLURRY_IOS_APP_KEY = 'XXCDHNFF247F7SDQQFC4';

    constructor(
        private fAnalytics: FlurryAnalytics,
        private platform: Platform) {

        // this.flurryAnalyticsInit();
    }

    flurryAnalyticsInit() {
        if (this.platform.is('cordova')) {
            let appKey: string;
            if (this.platform.is('android')) {
                appKey = this.FLURRY_ANDROID_APP_KEY;
            }
            else if (this.platform.is('ios')) {
                appKey = this.FLURRY_IOS_APP_KEY;
            }
            const options: FlurryAnalyticsOptions = {
                appKey: appKey,
                reportSessionsOnClose: true,
                enableLogging: true
            };
            this.fa = this.fAnalytics.create(options);
        }
    }

    faLogEvent(event: string) {
        if (this.platform.is('cordova')) {
            return this.fa.logEvent(event);
        }
        else return;
    }
}