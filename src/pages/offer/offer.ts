import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { RedeemedPopover } from './redeemed.popover';
import { CongratulationPopover } from './congratulation.popover';

@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html'
})
export class OfferPage {

  constructor(private nav: NavController,
    private popoverCtrl: PopoverController) {

  }

  //ionViewDidLoad() {
    //this.nav.pop();
  //  let popover = this.popoverCtrl.create(CongratulationPopover);
  //  popover.present();
  //}

  back() {
    //this.nav.pop();
    let popover = this.popoverCtrl.create(RedeemedPopover);
    popover.present();
  }

}
