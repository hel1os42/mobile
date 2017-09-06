import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AgmCoreModule } from '@agm/core';
import { LatLngLiteral } from "@agm/core";
import * as _ from 'lodash';
import { AuthService } from "../../providers/auth.service";
import { TabsPage } from "../tabs/tabs";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { UserAccount } from "../../models/userAccount";
import { ProfileService } from "../../providers/profile.service";
import { UserProfilePage } from "../user-profile/user-profile";
import { SplashScreenPage } from "../splash-screen/splash-screen";

@Component({
    selector: 'page-create-user-profile',
    templateUrl: 'create-user-profile.html'
})

export class CreateUserProfilePage {
    data: Register = new Register();
    coords: Coords = new Coords();
    account: UserAccount = new UserAccount();
    message: string;
    isSelectVisible: boolean = false;
    points: number = 0;
    isFocusName: boolean = false;
    isFocusEmail: boolean = false;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private location: LocationService,
        private changeDetectorRef: ChangeDetectorRef,
        private profileService: ProfileService) {
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
                this.account.address = results[1].formatted_address;
                this.changeDetectorRef.detectChanges();
                console.log(results);
            }
        });
    }

    ionViewDidLoad() {
        this.account = this.profileService.userAccount;

        if (this.account.name)
            this.isFocusName = true;
        if (this.account.email)
            this.isFocusEmail = true;




        /* this.data = this.auth.getRegisterData();
         if (this.data.referrer_id)
             return;
         else {
            let inviteCode = this.auth.getInviteCode();
            this.auth
                .getReferrerId(inviteCode)
                .subscribe(register => this.data = register);
         }*/
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

    register() {
        /*this.auth
            .register(this.data)
            .subscribe(resp => {
                this.auth
                    .login({
                        email: this.data.email,
                        password: this.data.password
                    })
                    .subscribe(resp => {
                        this.nav.setRoot(TabsPage);
                    })
            }
            );*/
            this.profileService.set(this.account)
                .subscribe(resp => this.nav.setRoot(SplashScreenPage));
    }

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }

    focusName() {
        this.isFocusName = true;
    }

    focusEmail() {
        this.isFocusEmail = true;
    }
}
