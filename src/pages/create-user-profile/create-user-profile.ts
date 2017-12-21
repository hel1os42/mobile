import { Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { AlertController, LoadingController, NavController, Platform } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Map } from 'leaflet';
import leaflet, { latLng, LeafletEvent, tileLayer } from 'leaflet';
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
    facebookName: string;
    twitterName: string;
    instagramName: string;
    gender: string;
    age: number;
    income;
    picture_url: string;
    isEdit = false;
    changedPicture = false;
    tileLayer;
    _map: Map;
    options;

    constructor(private nav: NavController,
        private location: LocationService,
        private profile: ProfileService,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService,
        private navParams: NavParams,
        private loading: LoadingController,
        private alertCtrl: AlertController,
        private platform: Platform) {


        if (this.navParams.get('user')) {
            this.isEdit = true;
            this.user = this.navParams.get('user');
            this.picture_url = this.user.picture_url;
            this.coords.lat = this.user.latitude;
            this.coords.lng = this.user.longitude;
            this.addMap();
        }
        else {
            this.profile.get(true)
                .subscribe(resp => {
                    this.user = resp;
                    this.picture_url = this.user.picture_url;
                });
            this.getLocation();
        }
    }

    getLocation() {
        let loadingLocation = this.loading.create({ content: 'Detection location', spinner: 'bubbles' });
        loadingLocation.present();

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                loadingLocation.dismissAll();
                this.addMap();
            })
            .catch((error) => {
                this.message = error.message;
            });
        setTimeout(() => {
            if (!this.coords.lat) {
                this.location.getByIp()
                    .subscribe(resp => {
                        this.coords = {
                            lat: resp.latitude,
                            lng: resp.longitude
                        };
                            loadingLocation.dismissAll(); 
                            this.addMap(); 
                    })
            }
        }, 9000);
        setTimeout(() => {
            if (!this.coords.lat) {
                loadingLocation.dismissAll();
                this.presentConfirm();
            }
            else {
                loadingLocation.dismissAll();
            }
        },12000);
    }

    presentConfirm() {
        let confirm = this.alertCtrl.create({
            title: 'To create account your location needed',
            message: 'Enable location services, please, check conection. Then click Retry.',
            buttons: [
                {
                  text: 'Exit',
                  handler: () => {
                    this.platform.exitApp();
                  }
                },
                {
                  text: 'Retry',
                  handler: () => {
                    this.getLocation();
                  }
                }
              ]
        });
        confirm.present();
    }

    onMapReady(map: Map) {
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.coords = this._map.getCenter();
            }
        })
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
            zoom: 15,
            center: latLng(this.coords)
        };
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
                if (results[0] && results[0] != 'O') {
                    this.picture_url = results[0];
                    this.changedPicture = true;
                }
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    validateName(name) {
        if (name.length < 3 || name.replace(/\s/g, "") == "") {
            this.toast.show('User name must be atleast 3 charactrs long');
            return false;
        }
        else {
            return true;
        }

    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = re.test(email);
        if (!isValid) {
            this.toast.show('Incorrect email, please, correct it');
            return false;
        }
        else {
            return true;
        }
    }

    createAccount() {
            if (this.validateName(this.user.name) && this.validateEmail(this.user.email)) {
                this.user.latitude = this.coords.lat;
                this.user.longitude = this.coords.lng;
                //this.account.points = this.point(); to do
                this.profile.put(this.user)
                    .subscribe(user => {
                        if (this.picture_url && this.changedPicture) {
                            this.api.uploadImage(this.picture_url, 'profile/picture', true)
                                .then(() => {
                                    if (this.isEdit) {
                                        this.profile.refreshAccounts();
                                        this.nav.pop();
                                    }
                                    else {
                                        this.nav.setRoot(TabsPage, { selectedTabIndex: 1 });
                                    }
                                });
                        }
                        else {
                            if (this.isEdit) {
                                this.profile.refreshAccounts();
                                this.nav.pop();
                            }
                            else {
                                this.nav.setRoot(TabsPage, { selectedTabIndex: 1 });
                            }
                        }
                    });
            }
        }
}

