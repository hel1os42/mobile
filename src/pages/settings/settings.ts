import { LatLngLiteral } from '@agm/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { App, NavController, NavParams, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { User } from '../../models/user';
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { AdvRedeemOfferPage } from '../adv-redeem-offer/adv-redeem-offer';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { CreateAdvUserProfilePage } from '../create-advUser-profile/create-advUser-profile';
import { OnBoardingPage } from '../onboarding/onboarding';
import { SettingsChangePhonePage } from '../settings-change-phone/settings-change-phone';
import { TabsPage } from '../tabs/tabs';
import { SettingsPopover } from './settings.popover';

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
    advPicture_url: string;

    constructor(
        private nav: NavController,
        private profile: ProfileService,
        private location: LocationService,
        private appMode: AppModeService,
        private app: App,
        private popoverCtrl: PopoverController,
        private changeDetectorRef: ChangeDetectorRef,
        private navParams: NavParams,
        private place: PlaceService ) {

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.user = this.navParams.get('user');
        this.coords.lat = this.user.latitude;
        this.coords.lng = this.user.longitude;
        if(!this.user.id) {
            this.profile.get(true)
                .subscribe(user => this.user = user);
        }
        
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
                resp => {
                    this.nextPage = AdvTabsPage;
                    this.advPicture_url = resp.picture_url;
                },
                errResp => this.nextPage = undefined);
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
        if (this.isAdvMode && !this.nextPage) {
            let popover = this.popoverCtrl.create(SettingsPopover, { page: CreateAdvUserProfilePage, latitude: this.coords.lat, longitude: this.coords.lng});
            popover.present();
        }
        return this.isAdvMode;
    }

    saveProfile() {
        this.appMode.setAdvMode(this.isAdvMode);
        // this.user.latitude = this.coords.lat;
        // this.user.longitude = this.coords.lng;
        // this.profile.put(this.user)
            // .subscribe(resp => {to do
                if (!this.isChangeMode) {
                    this.nav.pop();
                }
                else {
                    if (this.isAdvMode && !this.nextPage) {
                        this.app.getRootNav().push(OnBoardingPage, {isAdvMode: true, page: CreateAdvUserProfilePage, isAdvOnBoarding: true, latitude: this.coords.lat, longitude: this.coords.lng});
                    }
                    else 
                    if (this.isAdvMode) {
                        this.app.getRootNav().push(OnBoardingPage, {isAdvMode: true, page: this.nextPage, isAdvOnBoarding: true});
                    }
                    else {
                        this.app.getRootNav().push(TabsPage);
                    }
                    
                }
            // });
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