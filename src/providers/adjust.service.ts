import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StorageService } from './storage.service';

declare var Adjust, AdjustConfig, AdjustEvent;

@Injectable()
export class AdjustService {

    ADJUST_ANDROID_APP_TOKEN = 'ztmblhuttfcw';
    // ADJUST_IOS_APP_TOKEN = 'ih8sgf2a82dc';
    // onEnvironmentModeSubscription: Subscription;
    TOKENS = {

        ACTION_REDEMPTION: 'ubabaz',
        EXTERNAL_CLICK_ON_BRANCH_LINK: 'c0xgvd',
        FACEBOOK_LINK: 'pbctv3',
        FACEBOOK_SIGN_IN: '1e1wi5',
        FIRST_TIME_SIGN_IN: 'pan15t',
        IN_FR_BUTTON_CLICK_INVITE_PAGE: 'nnlmzv',
        IN_FR_BUTTON_CLICK_PROFILE_PAGE: 'ovmpim',
        INVITE_FRIENDS_PAGE_VISIT: 'e8jdin',
        LOGOUT_BUTTON_CLICK: 'su4pad',
        NAU_FRIENDS_CLICK: '6e4t9i',
        NAU_TX_SEND: '5brxir',
        NAU_WALLET_CLICK: 'tyr0wb',
        OFFER_VIEW: 'jxilrg',
        PHONE_ICON_CLICK: 'ivycrp',
        PLACE_VIEW: '61w3zh',
        REDEEM_BUTTON_CLICK: 'urv640',
        REPORT_BUTTON_CLICK: 'q7e39h',
        REPORT_SENT: '8efs8b',
        SHARE_OFFER_BUTTON_CLICK: 'sldn02',
        SHARE_PLACE_BUTTON_CLICK: 'i12iu4',
        SIGN_IN: '6ld52c',
        SMS_INITIALIZE: 'g6g1ra',
        TOP_OFFER_FEED_CLICK: '8jzfe2',
        TOP_OFFERS_FEED_VISIT: 'ra1xd6',
        TWITTER_LINK: 'khqwq6',
        TWITTER_SIGN_IN: 'e3fcw2',
        VK_LINK: 'a9wn67',
        VK_SIGN_IN: 'y8tpmo',
        WEBSITE_ICON_CLICK: 'lhnd54'

    }

    constructor(
        private platform: Platform,
        private storage: StorageService) {

        // this.onEnvironmentModeSubscription = this.appMode.onEnvironmentMode
        //     .subscribe(() => this.init());

    }

    init() {
        if (typeof Adjust !== 'undefined' && typeof AdjustConfig !== 'undefined') {
            let appToken = this.ADJUST_ANDROID_APP_TOKEN;
            // if (this.platform.is('android')) {
            //     appToken = this.ADJUST_ANDROID_APP_TOKEN;
            // }
            // else if (this.platform.is('ios')) {
            //     appToken = this.ADJUST_IOS_APP_TOKEN;
            // }
            // let adjustConfig = new AdjustConfig(appToken, AdjustConfig.EnvironmentProduction); //for prod
            let adjustConfig = new AdjustConfig(appToken, AdjustConfig.EnvironmentSandbox); //for test

            // adjustConfig.setAttributionCallbackListener(function (attribution) {
            //     // Printing all attribution properties.
            //     console.log(attribution);
            // });

            adjustConfig.setDeferredDeeplinkCallbackListener(deeplink => {
                // console.log("Deferred deep link URL content: " + deeplink);
                let str = deeplink.split('invite_code=')[1];
                let invite = str.split('?')[0];

                if (invite) {
                    this.storage.set('invCode', invite);
                }
            });

            adjustConfig.setLogLevel(AdjustConfig.LogLevelInfo);
            Adjust.create(adjustConfig);

            // Adjust.getGoogleAdId(function (googleAdId) {
            //     console.log(googleAdId);
            // });
            // Adjust.getIdfa(function(idfa) //for ios
            //     // console.log(idfa);
            //     });
        }
    }

    setEvent(key) {
        if (typeof Adjust !== 'undefined' && typeof AdjustConfig !== 'undefined' && AdjustEvent !== 'undefined') {
            let adjustEvent = new AdjustEvent(this.TOKENS[key]);
            Adjust.trackEvent(adjustEvent);
        }
    }
}