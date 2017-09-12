import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RedeemedOffer } from '../../models/redeemedOffer';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'page-user-offers',
  templateUrl: 'user-offers.html'
})
export class UserOffersPage {
  offers: RedeemedOffer[];
  total: number;

  constructor(private nav: NavController,
              private profile: ProfileService) {

  }

  ionViewDidLoad() {
    this.profile.getOffers()
      .subscribe(resp => {            
          this.offers = resp.data;
          this.total = resp.total;
    })
}

}