import { Component } from '@angular/core';
import { AdvNotificationsPage } from '../adv-notifications/adv-notifications';
import { AdvUserOffersPage } from '../adv-user-offers/adv-user-offers';
import { AdvUserProfilePage } from '../adv-user-profile/adv-user-profile';
import { CreateOfferPage } from '../create-offer/create-offer';

@Component({
    selector: 'page-adv-tabs',
    templateUrl: 'adv-tabs.html'
})
export class AdvTabsPage {


    tab1Root = AdvUserProfilePage;
    tab2Root = AdvUserProfilePage;
    tab3Root = CreateOfferPage;
    tab4Root = AdvNotificationsPage;
    tab5Root = AdvUserOffersPage;

    constructor() {

    }

}