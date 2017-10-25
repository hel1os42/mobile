import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from "../pages/tabs/tabs";
import { AuthService } from "../providers/auth.service";
import { OnBoardingPage } from "../pages/onboarding/onboarding";
import { CreateAdvUserProfilePage } from "../pages/create-advUser-profile/create-advUser-profile";
import { CreateOfferPage } from "../pages/create-offer/create-offer";
import { AdvUserOffersPage } from "../pages/adv-user-offers/adv-user-offers";
import { LoginPage } from "../pages/login/login";
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { AdvTabsPage } from '../pages/adv-tabs/adv-tabs';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
        private auth: AuthService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.rootPage = !this.auth.isLoggedIn() ? OnBoardingPage : TabsPage;

            // this.rootPage = AdvTabsPage;
        })

        this.auth.onLogout.subscribe(() => this.rootPage = LoginPage);
    }
}
