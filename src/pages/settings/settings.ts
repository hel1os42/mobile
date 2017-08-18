import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { CreateAdvUserProfilePage } from "../create-advUser-profile/create-advUser-profile";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  user: User = new User;

  constructor(private nav: NavController,
    private profile: ProfileService) {

  }

  ionViewDidEnter() {
    this.profile.get()
      .subscribe(user => this.user = user);
  }

  saveProfile() {
    this.nav.pop();
    //this.profile.set(this.user);
    //.subscribe(res => )
  }

  openCreateAdvUser() {
    this.nav.push(CreateAdvUserProfilePage);
  }
}