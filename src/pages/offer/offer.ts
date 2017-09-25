import { Component } from '@angular/core';
import { NavController, PopoverController, App } from 'ionic-angular';
import { RedeemedPopover } from './redeemed.popover';
import { CongratulationPopover } from './congratulation.popover';
import { AppModeService } from '../../providers/appMode.service';
import { Offer } from '../../models/offer';

@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html'
})
export class OfferPage {

  offer = new Offer;

  constructor(
    private nav: NavController,
    private popoverCtrl: PopoverController) {

  }

  //ionViewDidLoad() {
    //this.nav.pop();
  //  let popover = this.popoverCtrl.create(CongratulationPopover);
  //  popover.present();
  //}
  ionViewDidLoad() {
    
}

openRedeemPopover() {
    //this.nav.pop();
    let popover = this.popoverCtrl.create(RedeemedPopover);
    popover.present();
  }

}
