import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StorageService } from './storage.service';

declare var Adjust, AdjustConfig;

@Injectable()
export class AdjustService {

    ADJUST_ANDROID_APP_TOKEN = 'ztmblhuttfcw';
    ADJUST_IOS_APP_TOKEN = 'ih8sgf2a82dc';
    // onEnvironmentModeSubscription: Subscription;

    constructor(
        private platform: Platform,
        private storage: StorageService) {

        // this.onEnvironmentModeSubscription = this.appMode.onEnvironmentMode
        //     .subscribe(() => this.init());

    }

    init() {
        let storage = this.storage;
        if (typeof Adjust !== 'undefined' && typeof AdjustConfig !== 'undefined') {
            let appToken: string;
            if (this.platform.is('android')) {
                appToken = this.ADJUST_ANDROID_APP_TOKEN;
            }
            else if (this.platform.is('ios')) {
                appToken = this.ADJUST_IOS_APP_TOKEN;
            }
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
                    storage.set('invCode', invite);
                }
            });

            adjustConfig.setLogLevel(AdjustConfig.LogLevelInfo);
            Adjust.create(adjustConfig);

            Adjust.getGoogleAdId(function (googleAdId) {
                console.log(googleAdId);
            });
            // Adjust.getIdfa(function(idfa) //for ios
            //     // console.log(idfa);
            //     });
        }
    }
}