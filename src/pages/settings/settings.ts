import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, Navbar, App, PopoverController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { AgmCoreModule } from '@agm/core';
import { LatLngLiteral } from "@agm/core";
import { User } from "../../models/user";
import { ProfileService } from "../../providers/profile.service";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { TabsPage } from "../tabs/tabs";
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { AuthService } from '../../providers/auth.service';
import { SettingsPopover } from './settings.popover';
import { AppModeService } from '../../providers/appMode.service';
import { SettingsChangePhonePage } from '../settings-change-phone/settings-change-phone';
import { AdvRedeemOfferPage } from '../adv-redeem-offer/adv-redeem-offer';
import { CreateAdvUserProfilePage } from '../create-advUser-profile/create-advUser-profile';
import { OnBoardingPage } from '../onboarding/onboarding';
import { PlaceService } from '../../providers/place.service';


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
    isAdvMode = false;
    isChangeMode = false;
    showData: boolean = false;
    showPhone: boolean = false;
    showEmail: boolean = false;
    nextPage: any;

    constructor(
        private nav: NavController,
        private profile: ProfileService,
        private location: LocationService,
        private appMode: AppModeService,
        private app: App,
        private auth: AuthService,
        private popoverCtrl: PopoverController,
        private changeDetectorRef: ChangeDetectorRef,
        private navParams: NavParams,
        private place: PlaceService ) {

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.user = this.navParams.get('user');
        if(!this.user.id) {
            this.profile.get()
                .subscribe(user => this.user = user);
        }

        // this.profile.getWithAccounts()
        //     .subscribe(resp => this.user = resp);
        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
            })
            .catch((error) => {
                this.message = error.message;
            });

        this.place.get()
            .subscribe(
            resp => this.nextPage = AdvTabsPage,
            errResp => this.nextPage = CreateAdvUserProfilePage);
    }

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

    toggleAdvMode() {
        this.isChangeMode = !this.isChangeMode;
        if (this.isAdvMode && this.nextPage == CreateAdvUserProfilePage) {
            let popover = this.popoverCtrl.create(SettingsPopover, { page: this.nextPage});
            popover.present();
        }
        return this.isAdvMode;
    }

    saveProfile() {
        this.appMode.setAdvMode(this.isAdvMode);
        this.user.latitude = this.coords.lat;
        this.user.longitude = this.coords.lng;
        this.profile.put(this.user)
            .subscribe(resp => {
                if (!this.isChangeMode) {
                    this.nav.pop();
                }
                else {
                    if (this.isAdvMode) {
                        this.app.getRootNav().push(OnBoardingPage, {isAdvMode: true, page: this.nextPage, isAdvOnBoarding: true});
                    }
                    else {
                        this.app.getRootNav().push(TabsPage);
                    }
                    
                }
            });
    }

    toggleAccountsChoiceVisible() {
        this.isAccountsChoiceVisible = !this.isAccountsChoiceVisible;
    }

    toggleSelectRadiusVisible() {
        this.isSelectRadiusVisible = !this.isSelectRadiusVisible;
    }

    openChangePhone(user: User) {
        this.nav.push(SettingsChangePhonePage, { user: this.user });
    }

    openAdvRedeem() {
        this.nav.push(AdvRedeemOfferPage);
    }

}