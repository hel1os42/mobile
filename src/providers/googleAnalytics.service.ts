import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppModeService } from './appMode.service';
import { Subscription } from 'rxjs';

@Injectable()

export class GoogleAnalyticsService {

    GOOGLE_ANALYTICS_ID = 'UA-114471660-1';
    ONE_SIGNAL_APP_ID = 'b08f4540-f5f5-426a-a7e1-3611e2a11187';
    ONE_SIGNAL_GOOGLE_PROJECT_NUMBER = '943098821317';

    EVENTS = {
        ACTION_REDEMPTION: 'Action Redemption',
        EXTERNAL_CLICK_ON_BRANCH_LINK: 'External Click On Branch Link',
        FACEBOOK_LINK: 'Facebook Link',
        FACEBOOK_SIGN_IN: 'Facebook Sign In',
        FIRST_TIME_SIGN_IN: 'First time Sign In',
        IN_FR_BUTTON_CLICK_INVITE_PAGE: 'In Fr Button Click Invite Page',
        IN_FR_BUTTON_CLICK_PROFILE_PAGE: 'In Fr Button Click Profile Page',
        INVITE_FRIENDS_PAGE_VISIT: 'Invite Friends Page Visit',
        LOGOUT_BUTTON_CLICK: 'Logout Button Click',
        NAU_FRIENDS_CLICK: 'Nau Friends Click',
        NAU_TX_SEND: 'Nau Tx Send',
        NAU_WALLET_CLICK: 'Nau Wallet Click',
        OFFER_VIEW: 'Offer View',
        PHONE_ICON_CLICK: 'Phone Icon Click',
        PLACE_VIEW: 'Place View',
        REDEEM_BUTTON_CLICK: 'Redeem Button Click',
        REPORT_BUTTON_CLICK: 'Report Button Click',
        REPORT_SENT: 'Report Sent',
        SHARE_OFFER_BUTTON_CLICK: 'Share Offer Button Click',
        SHARE_PLACE_BUTTON_CLICK: 'Share Place Button Click',
        SIGN_IN: 'Sign In',
        SMS_INITIALIZE: 'Sms Initialize',
        TOP_OFFER_FEED_CLICK: 'Top Offer Feed Click',
        TOP_OFFERS_FEED_VISIT: 'Top Offers Feed Visit',
        TWITTER_LINK: 'Twitter Link',
        TWITTER_SIGN_IN: 'Twitter Sign In',
        VK_LINK: 'Vk Link',
        VK_SIGN_IN: 'Vk Sign In',
        WEBSITE_ICON_CLICK: 'Website Icon Click'
    };
    envName: string;
    onEnvironmentModeSubscription: Subscription;

    constructor(
        private gAnalytics: GoogleAnalytics,
        private appMode: AppModeService) {

        this.envName = this.appMode.getEnvironmentMode();

        this.onEnvironmentModeSubscription = this.appMode.onEnvironmentMode
            .subscribe(name => {
                this.envName = name;
                this.init();
            });
    }


    init() {
        this.gAnalytics.startTrackerWithId(this.GOOGLE_ANALYTICS_ID)
            .then(() => {
                this.gAnalytics.trackView('init');
                // Tracker is ready
                this.gAnalytics.debugMode();
                this.gAnalytics.setAllowIDFACollection(true);
                this.gAnalytics.enableUncaughtExceptionReporting(true);
            })
            .catch(err => console.log('Error starting GoogleAnalytics', err));
    }

    setUserId(id: string) {
        this.gAnalytics.setUserId(id);
    }

    trackEvent(key: string) {
        let event = this.EVENTS[key];
        this.gAnalytics.trackEvent(this.envName, event);
    }

}