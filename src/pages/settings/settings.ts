import { Component } from '@angular/core';
import { App, NavController, NavParams, PopoverController } from 'ionic-angular';
import leaflet, { latLng, tileLayer } from 'leaflet';
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
    time = new Date().valueOf();
    tileLayer;
    options;

    constructor(
        private nav: NavController,
        private profile: ProfileService,
        private location: LocationService,
        private appMode: AppModeService,
        private app: App,
        private popoverCtrl: PopoverController,
        private navParams: NavParams,
        private place: PlaceService) {

        this.isAdvMode = this.navParams.get('isAdvMode');
        this.user = this.navParams.get('user');
        this.coords.lat = this.user.latitude;
        this.coords.lng = this.user.longitude;
        this.addMap();
        if (!this.user.id) {
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

        this.place.get(true)
            .subscribe(
            resp => {
                this.nextPage = AdvTabsPage;
                this.advPicture_url = resp.picture_url;
            },
            errResp => this.nextPage = undefined);
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            maxNativeZoom: 18,
            minZoom: 1,
            attribution: '...',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
            tap: true,
        });
        this.options = {
            layers: [this.tileLayer],
            zoom: 13,
            center: latLng(this.coords)
        };
    }

    toggleAdvMode() {
        this.isChangeMode = !this.isChangeMode;
        if (this.isAdvMode && !this.nextPage) {
            let popover = this.popoverCtrl.create(SettingsPopover, { page: CreateAdvUserProfilePage, latitude: this.coords.lat, longitude: this.coords.lng });
            popover.present();
        }
        return this.isAdvMode;
    }

    saveProfile() {
        this.appMode.setAdvMode(this.isAdvMode);
        let isShownOnboard = this.appMode.getOnboardingVisible()
        // this.user.latitude = this.coords.lat;
        // this.user.longitude = this.coords.lng;
        // this.profile.put(this.user)
        // .subscribe(resp => {to do
        if (!this.isChangeMode) {
            this.nav.pop();
        }
        else {
            if (this.isAdvMode && !this.nextPage) {
                this.app.getRootNav().setRoot(OnBoardingPage, { isAdvMode: true, page: CreateAdvUserProfilePage, isAdvOnBoarding: true, latitude: this.coords.lat, longitude: this.coords.lng });
            }
            else
                if (this.isAdvMode) {
                    if (!isShownOnboard) {
                        this.app.getRootNav().setRoot(OnBoardingPage, { isAdvMode: true, page: this.nextPage, isAdvOnBoarding: true });
                    }
                    else {
                        this.app.getRootNav().setRoot(AdvTabsPage, { isAdvMode: true, isAdvOnBoarding: true });
                    }
                }
                else {
                    this.app.getRootNav().setRoot(TabsPage);
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
