import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs, NavParams } from 'ionic-angular';
import { AdvUserProfilePage } from "../adv-user-profile/adv-user-profile";
import { CreateOfferPage } from "../create-offer/create-offer";
import { AdvUserOffersPage } from "../adv-user-offers/adv-user-offers";
import { AdvNotificationsPage } from "../adv-notifications/adv-notifications";

@Component({
    selector: 'page-adv-tabs',
    templateUrl: 'adv-tabs.html'
})
export class AdvTabsPage {

    @ViewChild('tabs') tabs: Tabs;

    tab1Root = AdvUserProfilePage;
    tab2Root = AdvUserProfilePage;
    tab3Root = CreateOfferPage;
    tab4Root = AdvNotificationsPage;
    tab5Root = AdvUserOffersPage;

    constructor(private nav: NavController,
                private navParams: NavParams) {

    }

}