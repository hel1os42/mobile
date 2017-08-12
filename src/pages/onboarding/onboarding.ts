import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
  code: string;

  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }

skip() {
   this.nav.push(StartPage);
}

}