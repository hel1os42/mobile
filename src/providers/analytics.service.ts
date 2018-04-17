import { Injectable } from '@angular/core';
import { FlurryAnalyticsOptions, FlurryAnalyticsObject, FlurryAnalytics } from '@ionic-native/flurry-analytics';
import { Platform } from 'ionic-angular';

@Injectable()
export class AnalyticsService {

    fa: FlurryAnalyticsObject;

    constructor(
        private fAnalytics: FlurryAnalytics,
        private platform: Platform) {

        // this.flurryAnalyticsInit();
    }

    flurryAnalyticsInit() {
        if (this.platform.is('cordova')) {
            let appKey: string;
            if (this.platform.is('android')) {
                appKey = 'WGQND43HCBMFK3Y4Y7X4';
            }
            else if (this.platform.is('ios')) {
                appKey = 'XXCDHNFF247F7SDQQFC4';
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