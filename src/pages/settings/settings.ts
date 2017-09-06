import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { CreateAdvUserProfilePage } from "../create-advUser-profile/create-advUser-profile";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  user: User = new User;
  message: string;
  coords: Coords = new Coords();
  radiuses = [100, 150, 200, 250, 500, 1000];
  radius: number = 5;
  isAccountsChoiceVisible: boolean = false;
  isSelectRadiusVisible: boolean = false;

  //@ViewChild(Navbar) navBar: Navbar;
  

  constructor(private nav: NavController,
              private profile: ProfileService,
              private location: LocationService){

  }

  /*ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo
     this.nav.pop();
    }
  }*/

  ionViewDidEnter() {
    this.profile.get()
      .subscribe(user => this.user = user);

      this.location.get()
      .then((resp) => {                
          this.coords = {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
          };
      })
      .catch((error) => {
          this.message = error.message;
          console.log(this.message);
      });
  }

  saveProfile() {
    this.nav.pop();
    //this.profile.set(this.user);
    //.subscribe(res => )
  }

  openCreateAdvUser() {
    this.nav.push(CreateAdvUserProfilePage);
  }

  toggleAccountsChoiceVisible() {
      this.isAccountsChoiceVisible = !this.isAccountsChoiceVisible;
  }

  toggleSelectRadiusVisible() {
    this.isSelectRadiusVisible = !this.isSelectRadiusVisible;
  }
  
}