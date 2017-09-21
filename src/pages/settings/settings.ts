import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, Navbar, App, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';
import { AgmCoreModule } from '@agm/core';
import { LatLngLiteral } from "@agm/core";
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { CreateAdvUserProfilePage } from "../create-advUser-profile/create-advUser-profile";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { TabsPage } from "../tabs/tabs";
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { AuthService } from '../../providers/auth.service';
import { SettingsPopover } from './settings.popover';
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
  isAccountsChoiceVisible: boolean = false;
  isSelectRadiusVisible: boolean = false;
  isAdvMode: boolean;
  isVisibleModal: boolean = false;
  isToggled: boolean = false;


  //@ViewChild(Navbar) navBar: Navbar;


  constructor(
    private nav: NavController,
    private profile: ProfileService,
    private location: LocationService,
    private appMode: AppModeService,
    private app: App,
    private auth: AuthService,
    private popoverCtrl: PopoverController,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  /*ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo
     this.nav.pop();
    }
  }*/

  onMapCenterChange(center: LatLngLiteral) {
    this.coords.lat = center.lat;
    this.coords.lng = center.lng;
    this.geocodeDebounced();
  }

  geocodeDebounced = _.debounce(this.geocode, 1000);

  geocode() {
    let google = window['google'];
    let geocoder = new google.maps.Geocoder();
    let latlng = { lat: this.coords.lat, lng: this.coords.lng };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        this.changeDetectorRef.detectChanges();
        console.log(results);
      }
    });
  }

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
    this.isToggled = true;
    this.appMode.setAdvMode(this.isAdvMode);
    this.isVisibleModal = this.isAdvMode;
    if (this.isAdvMode) {
      let popover = this.popoverCtrl.create(SettingsPopover);
      popover.present();
    }
  }

  saveProfile() {
    this.user.latitude = this.coords.lat;
    this.user.longitude = this.coords.lng;
    this.profile.set(this.user)
      .subscribe(resp => {
        if (this.isToggled) {
          let page = this.isAdvMode ? AdvTabsPage : TabsPage;
          this.app.getRootNav().setRoot(page);
        }
        else
          this.nav.pop()
      });

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