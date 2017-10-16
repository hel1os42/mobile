import { Component } from '@angular/core';
import { RedeemedOffer } from '../../models/redeemedOffer';
import { OfferService } from '../../providers/offer.service';

@Component({
  selector: 'page-user-offers',
  templateUrl: 'user-offers.html'
})
export class UserOffersPage {
  offers: RedeemedOffer[];
  total: number;

  constructor(private offer: OfferService) {

  }

  ionViewDidLoad() {
    this.offer.getRedeemedOffers()
      .subscribe(resp => {            
          this.offers = resp.offers;
          this.total = resp.offers_count;
    })
}

}