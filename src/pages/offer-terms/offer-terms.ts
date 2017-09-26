import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-offer-terms',
  templateUrl: 'offer-terms.html'
})
export class OfferTermsPage {

  constructor(private nav: NavController) {

  }

  back() {
      this.nav.pop();
  }
}
