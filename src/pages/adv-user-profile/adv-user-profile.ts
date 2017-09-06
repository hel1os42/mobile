import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreateOfferPage } from "../create-offer/create-offer";
import { StorageService } from "../../providers/storage.service";

@Component({
  selector: 'page-adv-user-profile',
  templateUrl: 'adv-user-profile.html'
})
export class AdvUserProfilePage {
  isModalVisible: boolean;
  MODAL_VISIBLE_KEY = "modalVisible";

  constructor(private nav: NavController,
              private storage: StorageService) {

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
}
