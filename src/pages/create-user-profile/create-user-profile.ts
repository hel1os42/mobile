import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LatLngLiteral } from '@agm/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { Register } from '../../models/register';
import { User } from '../../models/user';
import { ApiService } from '../../providers/api.service';
import { LocationService } from '../../providers/location.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { TabsPage } from '../tabs/tabs';

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
    isValidName = false;
    isValidEmail = false;
    

    constructor(private nav: NavController,
        private location: LocationService,
        private changeDetectorRef: ChangeDetectorRef,
        private profile: ProfileService,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService) {

        this.profile.get(true)
            .subscribe(resp => this.user = resp);

        this.location.getByIp()
            .subscribe(resp => {
                this.coords = {
                    lat: resp.latitude,
                    lng: resp.longitude
                };
            })

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

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }

    toggleVisibleInfo() {
        this.visibleInfo = true;
    }

    addLogo() {
        let options = { maximumImagesCount: 1, width: 600, height: 600, quality: 75 };
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
                    this.api.uploadImage(this.picture_url, 'profile/picture', true)
                        .then(() => this.nav.setRoot(TabsPage, { selectedTabIndex: 1 }));
                }
                else {
                    this.nav.setRoot(TabsPage, { selectedTabIndex: 1 });
                }
            });
    }

    validateName(name) {
        if (name.length < 3 || name.replace(/\s/g,"") == "") {
            this.toast.show('User name must be atleast 3 charactrs long');
            this.isValidName = false;
        }
        else {
            this.isValidName = true;
        }
        
    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = re.test(email);
        if (!isValid) {
            this.toast.show('Incorrect email, please, correct it');
        }
        this.isValidEmail = re.test(email);
    }


}
