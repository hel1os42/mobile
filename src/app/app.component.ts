import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicApp, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Subscription } from 'rxjs/Rx';
import { AVAILABLE_LANGUAGES, DEFAULT_LANG_CODE, SYS_OPTIONS } from '../const/i18n.const';
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { LoginPage } from '../pages/login/login';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../providers/auth.service';
import { LocationService } from '../providers/location.service';
import { ProfileService } from '../providers/profile.service';
import { StorageService } from '../providers/storage.service';
import { AppModeService } from '../providers/appMode.service';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;
    private onResumeSubscription: Subscription;

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
        private androidPermissions: AndroidPermissions,
        private diagnostic: Diagnostic) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            splashScreen.hide();

            statusBar.styleDefault();

            //this.appMode.setForkMode();// only for fork mode;

            if (platform.is('ios')) {
                statusBar.overlaysWebView(true);
            }

            // IPhone X
            if (platform.is('ios') && platform.width() == 375 && platform.height() == 812) {
                let body = <HTMLElement>(document.getElementsByTagName('ion-app')[0]);
                body.classList.add("iphonex");
                console.log('Width: ' + platform.width());
                console.log('Height: ' + platform.height());
            }

            this.branchInit(platform);

            this.initTranslate();

            if (!this.auth.isLoggedIn()) {
                this.rootPage = OnBoardingPage;
            }
            else {
                this.profile.get(true)
                    .subscribe(resp => {
                        this.rootPage = (!resp.name && !resp.email)
                            ? CreateUserProfilePage
                            : TabsPage;
                        // this.rootPage = SettingsPage;
                    });
            }
            this.onResumeSubscription = platform.resume.subscribe(() => {
                this.location.reset();
                this.branchInit(platform);
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
            if (platform.is('android')) {
                let
                    appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
                    appElHeight = appEl.clientHeight;

                window.addEventListener('native.keyboardshow', (e) => {
                    console.log("native.keyboardshow");
                    appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
                });

                window.addEventListener('native.keyboardhide', () => {
                    console.log("native.keyboardhide");
                    appEl.style.height = '100%';
                });
                //for location detection
                this.androidPermissions.requestPermissions([
                    this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
                    this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
                    this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS
                ])
                    .then(
                        result => {
                            console.log(result);
                            this.location.get();
                        },
                        err => console.log(err)
                    );
            }

        });

        this.auth.onLogout.subscribe(() => {
            this.app.getRootNav().setRoot(LoginPage);
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
                    console.log('Application exit prevented!');
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

    branchInit(platform) {
        // only on devices
        if (platform.is('cordova')) {
            const Branch = window['Branch'];
            // Branch.setDebug(true);//for development and debugging only
            // for better Android matching
            // Branch.setCookieBasedMatching('nau.test-app.link')
            Branch.initSession(data => {
                if (data['+clicked_branch_link']) {
                    // read deep link data on click
                    // let alert = this.alert.create({
                    //     title: 'Deep Link Data: ' + JSON.stringify(data),
                    // });
                    // alert.present();
                    if (data.invite_code) {
                        this.storage.set('invCode', data.invite_code);
                    }
                }
            });
        }
        else return;
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }
}
