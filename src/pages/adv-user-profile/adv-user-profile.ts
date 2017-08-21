import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreateOfferPage } from "../create-offer/create-offer";

@Component({
  selector: 'page-adv-user-profile',
  templateUrl: 'adv-user-profile.html'
})
export class AdvUserProfilePage {

  constructor(private nav: NavController) {

  }
  openCreateOffer() {
    this.nav.push(CreateOfferPage);
  }
}
