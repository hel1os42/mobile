import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { RedeemedPopover } from './redeemed.popover';

@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html'
})
export class OfferPage {

  constructor(private nav: NavController,
    private popoverCtrl: PopoverController,) {

  }

  back() {
    //this.nav.pop();
    let popover = this.popoverCtrl.create(RedeemedPopover);
    popover.present();
  }

}