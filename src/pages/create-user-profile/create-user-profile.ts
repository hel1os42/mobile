import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AgmCoreModule } from '@agm/core';
import { LatLngLiteral } from "@agm/core";
import * as _ from 'lodash';
import { TabsPage } from "../tabs/tabs";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { ProfileService } from "../../providers/profile.service";
import { User } from '../../models/user';
import { ImagePicker } from '@ionic-native/image-picker';
import { ToastService } from '../../providers/toast.service';
import { ApiService } from '../../providers/api.service';

@Component({
    selector: 'page-create-user-profile',
    templateUrl: 'create-user-profile.html'
})

export class CreateUserProfilePage {
    data: Register = new Register();
    coords: Coords = new Coords();
    user: User = new User();
    message: string;
    isSelectVisible: boolean = false;
    visibleInfo: boolean = false;
    address: string;
    facebookName: string;
    twitterName: string;
    instagramName: string;
    gender: string;
    age: number;
    income;
    picture_url: string;


    constructor(private nav: NavController,
        private location: LocationService,
        private changeDetectorRef: ChangeDetectorRef,
        private profile: ProfileService,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService) {

        this.profile.get()
            .subscribe(resp => this.user = resp);
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
                this.address = results[1].formatted_address;
                this.changeDetectorRef.detectChanges();
                console.log(results);
            }
        });
    }

    point() {
        let points = (this.user.name ? +8 : +0) + (this.facebookName ? +3 : +0) +
            (this.twitterName ? +3 : +0) + (this.instagramName ? +3 : +0) +
            (this.gender ? +5 : +0) + (this.age ? +9 : +0) + (this.income ? +9 : +0);
        return points;
    }

    ionViewDidLoad() {
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

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }

    toggleVisibleInfo() {
        this.visibleInfo = true;
    }

    addLogo() {
        let options = { maximumImagesCount: 1 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.picture_url = results[0];
                console.log(results[0]);
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    createAccount() {
        this.user.latitude = this.coords.lat;
        this.user.longitude = this.coords.lng;
        //this.account.points = this.point(); to do
        this.profile.put(this.user)
            .subscribe(resp => {
                if (this.picture_url) {
                    this.api.uploadImage(this.picture_url, 'profile/picture')
                        .then(resut => this.nav.setRoot(TabsPage, { selectedTabIndex: 1 }));
                }
                else {
                    this.nav.setRoot(TabsPage, { selectedTabIndex: 1 });
                }
            });
    }
}
