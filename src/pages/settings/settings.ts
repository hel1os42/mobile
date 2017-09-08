import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar, App } from 'ionic-angular';
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { CreateAdvUserProfilePage } from "../create-advUser-profile/create-advUser-profile";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { StorageService } from "../../providers/storage.service";
import { TabsPage } from "../tabs/tabs";


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
  isAdvMode: boolean;
  isVisibleModal: boolean = false;
  ADV_MODE_KEY = "isAdvMode";

  //@ViewChild(Navbar) navBar: Navbar;
  

  constructor(
    private nav: NavController,
    private profile: ProfileService,
    private location: LocationService,
    private storage: StorageService,
    private app: App){

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
      this.isAdvMode = this.storage.get(this.ADV_MODE_KEY);
  }

  toggleAdvMode() {
    this.storage.set(this.ADV_MODE_KEY, this.isAdvMode);
  }

  saveProfile() {
    this.app.getRootNav().setRoot(TabsPage);
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

  closeModal() {
    this.isVisibleModal = !this.isVisibleModal;
  }
  
}