import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppModeService } from './appMode.service';
import { Subscription } from 'rxjs';
import { App, Platform } from 'ionic-angular';

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

    TITLES = {
        OnBoardingPage: 'Intro 1',
        OnBoardingPage_1: 'Intro 2',
        OnBoardingPage_2: 'Intro 3',
        LoginPage: 'Sign up',
        PlacesPage_food: 'F&D Feed (Home)',
        PlacesPage_beauty: 'H&B Feed (B&F)',
        PlacesPage_featured: 'Top Offers',
        PlacesPage_retail: 'R&S Feed',
        PlacesPage_accommodation: 'A&L Feed',
        PlacePage: 'Place View',
        OfferPage: 'Offer View',
        InvitePage: 'Inv. Fr. Page',
        UserProfilePage: 'Profile Page',
        UserUsersPage: 'Your Friends',
        UserOffersPage: 'Your Offers',
        UserNauPage: 'NAU Transact.',
        CreateUserProfilePage: 'Edit Account',
        SettingsPage: 'Settings',
        BookmarksPage: 'Bookmarks'
    };

    envName: string;
    onEnvironmentModeSubscription: Subscription;

    constructor(
        private gAnalytics: GoogleAnalytics,
        private appMode: AppModeService,
        private app: App,
        private platform: Platform) {

        this.envName = this.appMode.getEnvironmentMode();

        this.onEnvironmentModeSubscription = this.appMode.onEnvironmentMode
            .subscribe(name => {
                this.envName = name;
            });

        if (this.isProd()) {
            this.app.viewDidEnter.subscribe((evt) => {
                this.handleView(evt);
            });
        }
    }

    init() {
        this.gAnalytics.startTrackerWithId(this.GOOGLE_ANALYTICS_ID)
            .then(() => {
                // this.gAnalytics.trackView('init');
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
        if (this.isProd()) {
            let event = this.EVENTS[key];
            this.gAnalytics.trackEvent(this.envName, event);
        }
    }

    trackView(key) {
        if (this.isProd()) {
            let title = this.TITLES[key];
            this.gAnalytics.trackView(title);
        }
    }

    handleView(view) {
        const STR = 'Page';
        let pageName = view.instance.constructor.name;
        let instance = view.instance;

        if (pageName.includes(STR)) {
            if (pageName === 'PlacesPage') {

                if (instance && instance.isFeatured) {
                    pageName = pageName + '_featured';
                } else if (instance && !instance.selectedCategory.name) {
                    pageName = pageName + '_food';
                } else if (instance) {
                    let categoryName = instance.selectedCategory.name.split(' ')[0].toLowerCase();
                    pageName = pageName + '_' + categoryName;
                }

            }
        }

        if (this.TITLES.hasOwnProperty(pageName)) {
            this.trackView(pageName);
        }
    }

    isProd() {
        return this.envName === 'prod';
    }

}