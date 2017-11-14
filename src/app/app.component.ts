import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { App, Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../providers/auth.service';
import { ProfileService } from "../providers/profile.service";
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { AdvRedeemOfferPage } from '../pages/adv-redeem-offer/adv-redeem-offer';


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
        private profile: ProfileService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            let page;
            this.profile.get()
                .subscribe(resp => {
                    page = (resp.name == '' && !resp.email) ? CreateUserProfilePage : TabsPage;
                    this.rootPage = !this.auth.isLoggedIn() ? OnBoardingPage : page;
                    //this.rootPage = AdvRedeemOfferPage;
                });
        });

        this.auth.onLogout.subscribe(() => {
            this.app.getRootNav().setRoot(LoginPage);
        });
    }
}
