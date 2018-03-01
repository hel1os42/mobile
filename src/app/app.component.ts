import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicApp, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Subscription } from 'rxjs/Rx';
import { AVAILABLE_LANGUAGES, DEFAULT_LANG_CODE, SYS_OPTIONS } from '../const/i18n.const';
import { Share } from '../models/share';
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { LoginPage } from '../pages/login/login';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { TabsPage } from '../pages/tabs/tabs';
import { AppModeService } from '../providers/appMode.service';
import { AuthService } from '../providers/auth.service';
import { LocationService } from '../providers/location.service';
import { NetworkService } from '../providers/network.service';
import { ProfileService } from '../providers/profile.service';
import { ShareService } from '../providers/share.service';
import { StorageService } from '../providers/storage.service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;
    onResumeSubscription: Subscription;
    onConnectSubscription: Subscription;

    constructor(platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private auth: AuthService,
        private app: App,
        private profile: ProfileService,
        private translate: TranslateService,
        private location: LocationService,
        private alert: AlertController,
        private storage: StorageService,
        private ionicApp: IonicApp,
        private appMode: AppModeService,
        private network: NetworkService,
        private analytics: GoogleAnalytics,
        private share: ShareService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            splashScreen.hide();

            statusBar.styleDefault();

            //Google Analytics
            this.analytics.startTrackerWithId('UA-114471660-1')
                .then(() => {
                    this.analytics.trackView('test');
                    // Tracker is ready
                    this.analytics.debugMode();
                    this.analytics.setAllowIDFACollection(true);
                })
                .catch(err => console.log('Error starting GoogleAnalytics', err));

            if (this.network.getStatus()) {
                if (!this.auth.isLoggedIn()) {
                    this.rootPage = OnBoardingPage;
                }
                else {
                    this.getRootPage();
                }
            }
            else {
                this.rootPage = OnBoardingPage;
                this.onConnectSubscription = this.network.onConnect
                    .subscribe(resp => {
                        this.getRootPage();
                    })
            }

            if (platform.is('ios')) {
                statusBar.overlaysWebView(true);
                this.appMode.setForkMode();// only for fork mode;
            }

            // IPhone X
            if (platform.is('ios') && platform.width() == 375 && platform.height() == 812) {
                let body = <HTMLElement>(document.getElementsByTagName('ion-app')[0]);
                body.classList.add("iphonex");
                console.log('Width: ' + platform.width());
                console.log('Height: ' + platform.height());
            }

            this.branchInit(platform, splashScreen);

            this.initTranslate();

            this.onResumeSubscription = platform.resume.subscribe(() => {
                this.location.reset();
                this.branchInit(platform, splashScreen, true);
            });

            //this.rootPage = TemporaryPage;
            platform.registerBackButtonAction(() => {

                let activePortal = ionicApp._loadingPortal.getActive() ||
                    this.ionicApp._modalPortal.getActive() ||
                    ionicApp._toastPortal.getActive() ||
                    ionicApp._overlayPortal.getActive();

                let nav = app.getActiveNavs()[0];

                if (activePortal) {
                    activePortal.dismiss();
                }
                //else if (this.menuCtrl.isOpen()) {
                //this.menuCtrl.close();
                //}
                else if (nav.canGoBack()) { //Can we go back?
                    nav.pop();
                }
                else {
                    this.presentConfirm(platform);
                }
            });

            // FIX KEYBOARD SCROLL

            // if (platform.is('android')) {
            //     let
            //         appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
            //         appElHeight = appEl.clientHeight;

            //     window.addEventListener('native.keyboardshow', (e) => {
            //         console.log("native.keyboardshow");
            //         //console.log("appElHeight " + appElHeight);
            //         //console.log("native.keyboardHeight " + (<any>e).keyboardHeight);
            //         setTimeout(function() {
            //             appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
            //         }, 50)
            //         //console.log("position scroll: " + window.pageYOffset || document.documentElement.scrollTop);
            //     });

            //     window.addEventListener('native.keyboardhide', () => {
            //         console.log("native.keyboardhide");
            //         appEl.style.height = '100%';
            //     });
            // }
        });

        this.auth.onLogout.subscribe(() => {
            this.app.getRootNav().setRoot(LoginPage);
        });

    }

    getRootPage() {
        this.profile.get(true)
            .subscribe(resp => {
                this.rootPage = (!resp.name && !resp.email)
                    ? CreateUserProfilePage
                    : TabsPage;
                // this.rootPage = SettingsPage;
            });
    }

    initTranslate() {
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(DEFAULT_LANG_CODE);

        // if ((<any>window).cordova) {
        //     Globalization.getPreferredLanguage().then(result => {
        //         var language = this.getSuitableLanguage(result.value);
        //         translate.use(language);
        //         sysOptions.systemLanguage = language;
        //     });
        // } else {

        let browserLang = this.translate.getBrowserLang();
        let isLang = AVAILABLE_LANGUAGES.map(p => p.code).find(i => i === browserLang);
        let langCode = isLang ? browserLang : DEFAULT_LANG_CODE;
        this.translate.use(langCode);

        SYS_OPTIONS.LANG_CODE = langCode;
    }

    presentConfirm(platform) {
        const alert = this.alert.create({
            title: 'Are you sure you want to close the application?',
            // message: 'Do you want to close the app?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    return;
                }
            }, {
                text: 'Ok',
                handler: () => {
                    platform.exitApp(); // Close this application
                }
            }]
        });
        alert.present();
    }

    branchInit(platform, splashScreen, isResume?: boolean) {
        // only on devices
        if (platform.is('cordova')) {
            const Branch = window['Branch'];
            // Branch.setDebug(true);//for development and debugging only
            // for better Android matching
            // Branch.setCookieBasedMatching('nau.test-app.link')
            Branch.initSession(data => {
                if (data['+clicked_branch_link']) {
                    // read deep link data on click
                    if (data.invite_code) {
                        this.storage.set('invCode', data.invite_code);
                    }
                    if (data.placeId && data.placeId !== '') {
                        let share: Share = {
                            page: data.page,
                            placeId: data.placeId,
                            offerId: data.offerId
                        };

                        this.share.set(share);
                        if (isResume) {
                            this.storage.set('share', share);
                            splashScreen.show();
                            window.location.reload(true);
                        }
                    }
                }
            });
        }
        else return;
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
        this.onConnectSubscription.unsubscribe();
    }
}
