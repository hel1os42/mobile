import { AdvRedeemOfferPage } from '../adv-redeem-offer/adv-redeem-offer';
import { Component } from '@angular/core';
import { AdvNotificationsPage } from '../adv-notifications/adv-notifications';
import { AdvUserOffersPage } from '../adv-user-offers/adv-user-offers';
import { AdvUserProfilePage } from '../adv-user-profile/adv-user-profile';
import { CreateOfferPage } from '../create-offer/create-offer';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-adv-tabs',
    templateUrl: 'adv-tabs.html'
})

// this page is not used

export class AdvTabsPage {

    isDevMode = false;

    tab1Root = AdvRedeemOfferPage;
    tab2Root = AdvUserProfilePage;
    tab3Root = CreateOfferPage;
    tab4Root = AdvNotificationsPage;
    tab5Root = AdvUserOffersPage;

    constructor(private appMode: AppModeService) {
        this.isDevMode = this.appMode.getEnvironmentMode() == 'dev';
    }

}