import { AppModeService } from '../../providers/appMode.service';
import { Subscription } from 'rxjs/Rx';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { Company } from '../../models/company';
import { User } from '../../models/user';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { StorageService } from '../../providers/storage.service';
import { AdvUserOffersPage } from '../adv-user-offers/adv-user-offers';
import { CreateOfferPage } from '../create-offer/create-offer';
import { SettingsPage } from '../settings/settings';
import { StatisticPage } from '../statistic/statistic';
import { UserNauPage } from '../user-nau/user-nau';

@Component({
    selector: 'page-adv-user-profile',
    templateUrl: 'adv-user-profile.html'
})
export class AdvUserProfilePage {

    @ViewChild(Content) content: Content;

    isModalVisible: boolean;
    MODAL_VISIBLE_KEY = "modalVisible";
    company = new Company();
    balance: number;
    NAU_Id: string;
    user = new User;
    onRefreshPlace: Subscription;
    onRefreshAccounts: Subscription;

    constructor(private nav: NavController,
        private storage: StorageService,
        private navParams: NavParams,
        private place: PlaceService,
        private profile: ProfileService,
        private appMode: AppModeService) {

        this.appMode.setOnboardingVisible()
        
        this.company = this.navParams.get('company');
        if (!this.company) {
            this.company = this.place.company;
        }

        this.onRefreshPlace = this.place.onRefreshCompany
            .subscribe(company => {
                this.company = company;
            });

        if (!this.company) {
            this.place.get()
                .subscribe(company => {
                    this.company = company;
                    this.content.resize();
                });
        }

        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.user = resp;
                this.balance = resp.accounts.NAU.balance;
                this.NAU_Id = resp.accounts.NAU.id;
            })
        
            if (!this.balance) {
        this.profile.getWithAccounts()
            .subscribe(resp => {
                this.user = resp;
                this.balance = resp.accounts.NAU.balance;
                this.NAU_Id = resp.accounts.NAU.id;
            })
    }
}

    ionViewWillEnter() {
        this.isModalVisible = this.storage.get(this.MODAL_VISIBLE_KEY);
    }

    openCreateOffer() {
        this.isModalVisible = true;
        this.storage.set(this.MODAL_VISIBLE_KEY, true);
        this.nav.push(CreateOfferPage);
    }

    closeModal() {
        this.isModalVisible = true;
        this.storage.set(this.MODAL_VISIBLE_KEY, true);
    }

    openSettings() {
        //this.app.getRootNav().setRoot(SettingsPage);
        this.nav.push(SettingsPage, { isAdvMode: true, user: this.user });
    }

    openUserNau() {
        this.nav.push(UserNauPage, { balance: this.balance, NAU_Id: this.NAU_Id });
    }

    openUserOffers() {
        this.nav.push(AdvUserOffersPage);
    }

    openStatistic() {
        this.nav.push(StatisticPage);
    }

    ionViewWillUnload() {
        this.onRefreshPlace.unsubscribe();
        this.onRefreshAccounts.unsubscribe();
    }
}
