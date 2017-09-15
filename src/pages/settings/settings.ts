import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar, App, PopoverController } from 'ionic-angular';
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { CreateAdvUserProfilePage } from "../create-advUser-profile/create-advUser-profile";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { TabsPage } from "../tabs/tabs";
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { AuthService } from '../../providers/auth.service';
import { PopoverComponent } from './popover.component';
import { AppModeService } from '../../providers/appMode.service';


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
  

  //@ViewChild(Navbar) navBar: Navbar;
  

  constructor(
    private nav: NavController,
    private profile: ProfileService,
    private location: LocationService,
    private appMode: AppModeService,
    private app: App,
    private auth: AuthService,
    private popoverCtrl: PopoverController){

  }

  /*ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo
     this.nav.pop();
    }
  }*/

  ionViewDidLoad() {
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
      this.isAdvMode = this.appMode.getAdvMode();
  }

  toggleAdvMode() {
    this.appMode.setAdvMode(this.isAdvMode);
    this.isVisibleModal = this.isAdvMode;
    if (this.isAdvMode) {
      let popover = this.popoverCtrl.create(PopoverComponent);
      popover.present();
    }
  }

  saveProfile() {
    let page = this.isAdvMode ? AdvTabsPage : TabsPage;
    this.app.getRootNav().setRoot(page);
    //this.profile.set(this.user);
    //.subscribe(res => )
  }

  // openCreateAdvUser() {
  //   this.nav.push(CreateAdvUserProfilePage);
  // }

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