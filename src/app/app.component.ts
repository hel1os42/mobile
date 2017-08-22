import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StartPage } from '../pages/start/start';
import { TabsPage } from "../pages/tabs/tabs";
import { AuthService } from "../providers/auth.service";
import { OnBoardingPage } from "../pages/onboarding/onboarding";
import { CreateUserProfilePage } from "../pages/create-user-profile/create-user-profile";
import { CreateAdvUserProfilePage } from "../pages/create-advUser-profile/create-advUser-profile";
import { CreateOfferPage } from "../pages/create-offer/create-offer";
import { SettingsPage } from "../pages/settings/settings";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { AdvUserProfilePage } from "../pages/adv-user-profile/adv-user-profile";
import { MyOffersPage } from "../pages/my-offers/my-offers";
import { OfferPage } from "../pages/offer/offer";
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
        auth: AuthService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.rootPage = auth.isLoggedIn()
                ? TabsPage
                : auth.isOnboardingShown()
                    ? StartPage
                    : OnBoardingPage;

          //this.rootPage = CreateOfferPage
        });
    }
}
