import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateOfferPage } from "../create-offer/create-offer";
import { StorageService } from "../../providers/storage.service";
import { SettingsPage } from '../settings/settings';
import { Company } from '../../models/company';
import { PlaceService } from '../../providers/place.service';

@Component({
    selector: 'page-adv-user-profile',
    templateUrl: 'adv-user-profile.html'
})
export class AdvUserProfilePage {
    isModalVisible: boolean;
    MODAL_VISIBLE_KEY = "modalVisible";
    company = new Company;

    constructor(private nav: NavController,
        private storage: StorageService,
        private navParams: NavParams,
        private place: PlaceService) {

        this.company = this.navParams.get('place')
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
        this.nav.push(SettingsPage, { isAdvMode: true });
    }
}
