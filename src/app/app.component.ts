import { DEFAULT_LANG_CODE, SYS_OPTIONS } from '../const/i18n.const';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { App, Platform } from 'ionic-angular';
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { LoginPage } from '../pages/login/login';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../providers/auth.service';
import { ProfileService } from '../providers/profile.service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private auth: AuthService,
                private app: App,
                private profile: ProfileService,
                private translate: TranslateService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.initTranslate();
    
            if (!this.auth.isLoggedIn()) {
                this.rootPage = OnBoardingPage;
            }
            else {
                this.profile.get(true)
                    .subscribe(resp => {
                        this.rootPage = (resp.name == '' && !resp.email)
                            ? CreateUserProfilePage
                            : TabsPage;
                    });
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


        let langCode = this.translate.getBrowserLang() || DEFAULT_LANG_CODE;
        this.translate.use(langCode);

        SYS_OPTIONS.LANG_CODE = langCode;
    }
}
