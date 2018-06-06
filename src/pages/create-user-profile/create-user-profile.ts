import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ImagePicker } from '@ionic-native/image-picker';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController, Platform } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { latLng, LeafletEvent, Map, tileLayer } from 'leaflet';
import * as _ from 'lodash';
import { Bounds, CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { Subscription } from 'rxjs';
import { Coords } from '../../models/coords';
import { Register } from '../../models/register';
import { User } from '../../models/user';
import { ApiService } from '../../providers/api.service';
import { LocationService } from '../../providers/location.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { DataUtils } from '../../utils/data.utils';
import { MapUtils } from '../../utils/map.utils';
import { StorageService } from '../../providers/storage.service';


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
    gender: string;//temporary
    baseGender: string;//temporary
    age: number;
    income;
    picture_url: string;
    // isEdit = false;
    changedPicture = false;
    tileLayer;
    _map: Map;
    options;
    baseData = new User();
    onResumeSubscription: Subscription;
    isConfirm = false;
    dataImg: any;
    cropperSettings: CropperSettings;
    canSaveImg = false;
    isCrop = false;
    backAction;
    isCoordsChenged = false;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    croppedHeight;
    croppedWidth;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private location: LocationService,
        private profile: ProfileService,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService,
        private navParams: NavParams,
        private loading: LoadingController,
        private alert: AlertController,
        private androidPermissions: AndroidPermissions,
        private diagnostic: Diagnostic,
        private changeDetectorRef: ChangeDetectorRef,
        private translate: TranslateService,
        private storage: StorageService) {

        this.gender = this.storage.get('gender');//temporary
        this.baseGender = this.gender;//temporary
        if (this.platform.is('cordova')) {
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                if (this.isConfirm) {
                    this.diagnostic.isLocationAvailable().then(result => {
                        if (!result) {
                            this.isConfirm = false;
                            this.presentConfirm();
                        }
                        else {
                            this.isConfirm = false;
                            this.getCoords();
                        }
                    });
                }
                else return;
            });
        }

        // if (this.navParams.get('user')) {
        // this.isEdit = true;
        this.user = this.navParams.get('user');
        this.baseData = _.clone(this.user);
        this.picture_url = this.user.picture_url;
        this.coords.lat = this.baseData.latitude;
        this.coords.lng = this.baseData.longitude;
        if (this.coords.lat) {
            this.addMap();
        }
        else {
            this.getLocationStatus();
        }
        // }
        // else {
        //     this.profile.get(true)
        //         .subscribe(resp => {
        //             this.user = resp;
        //             this.baseData = _.clone(this.user);
        //             this.picture_url = this.user.picture_url;
        //         });
        //     this.getLocationStatus();
        // }

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.cropOnResize = true;
        this.cropperSettings.fileType = 'image/jpeg';
        this.cropperSettings.width = 1024;
        this.cropperSettings.height = 1024;
        this.cropperSettings.croppedWidth = 1024;
        this.cropperSettings.croppedHeight = 1024;
        // this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasWidth = this.platform.width();
        // this.cropperSettings.canvasHeight = this.isEdit
        //     ? this.platform.height() - 24
        //     : this.platform.height();
        this.cropperSettings.canvasHeight = this.platform.height() - 24
        //this.cropperSettings.cropperClass = "cropper-style";
        //this.cropperSettings.croppingClass = "cropper-style2";
        // this.cropperSettings.preserveSize = true;
        this.dataImg = {};
    }

    getLocationStatus() {
        if (this.platform.is('android') && this.platform.is('cordova')) {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => {
                    if (result.hasPermission === false) {
                        this.requestPerm();
                    }
                    else {
                        this.getLocation(false);
                    }
                    console.log(result)
                },
                err => {
                    this.requestPerm();
                    console.log(err)
                }
            )
        }
        else if (this.platform.is('ios') && this.platform.is('cordova')) {
            this.diagnostic.getLocationAuthorizationStatus()
                .then(resp => {
                    if (resp === 'NOT_REQUESTED' || resp === 'NOT_DETERMINED' || resp === 'not_requested' || resp === 'not_determined') {
                        this.diagnostic.requestLocationAuthorization()
                            .then(res => {
                                this.getLocation(false);
                            })
                    }
                    else {
                        this.getLocation(false);
                    }
                })
        }
        else {
            this.getLocation(false);
        }
    }

    requestPerm() {
        this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
            this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS
        ])
            .then(
                result => {
                    if (result.hasPermission === false) {
                        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                            result => {
                                if (result.hasPermission === false) {
                                    this.presentAndroidConfirm();
                                }
                                else {
                                    this.getLocation(false);
                                }
                            });
                    }
                    else {
                        this.getLocation(false);
                    }
                    console.log(result)
                },
                err => {
                    this.requestPerm();
                }
            )
    }


    getLocation(isDenied: boolean) {
        if (!isDenied) {
            if (!this.platform.is('cordova')) {
                this.getCoords();
            }
            else {
                this.diagnostic.isLocationAvailable().then(result => {
                    if (!result) {
                        this.presentConfirm();
                    }
                    else {
                        this.getCoords();
                    }
                });
            }
        }
        else {
            this.location.getByIp()
                .subscribe(resp => {
                    this.coords = {
                        // lat: resp.latitude,
                        // lng: resp.longitude
                        lat: resp.lat,
                        lng: resp.lon
                    };
                    this.addMap();
                    this.changeDetectorRef.detectChanges();
                })
        }
    }

    getNativeCoords(isHighAccuracy: boolean, loadingLocation) {
        this.location.get(isHighAccuracy)
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                loadingLocation.dismissAll();
                this.addMap();
                setTimeout(() => {
                    this.changeDetectorRef.detectChanges();
                    this._map.setView(this.coords, 15);
                }, 600);
                // this._map.setView(this.coords, 15);
            })
            .catch((error) => {
                loadingLocation.dismissAll();
                this.presentConfirm();
            })
    }

    getCoords() {
        this.translate.get('TOAST.LOCATION_DETECTION')
            .subscribe(resp => {
                let loadingLocation = this.loading.create({
                    content: resp,
                    spinner: 'bubbles'
                });
                loadingLocation.present();
                if (this.platform.is('android')) {
                    this.diagnostic.getLocationMode()
                        .then(res => {
                            this.getNativeCoords(res === 'high_accuracy', loadingLocation);
                        });
                }
                else {
                    this.getNativeCoords(false, loadingLocation);
                }
            })
    }

    onMapReady(map: Map) {
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.coords = this._map.getCenter();
                this.isCoordsChenged = true;
                if (this.coords.lng > 180 || this.coords.lng < -180) {
                    this.coords.lng = MapUtils.correctLng(this.coords.lng);
                    this._map.setView(this.coords, this._map.getZoom());
                };
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            maxNativeZoom: 18,
            minZoom: 1,
            attribution: '© OpenStreetMap',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
            tap: true,
        });
        this.options = {
            layers: [this.tileLayer],
            zoom: 9,
            center: latLng(this.coords),
            // zoomSnap: 0.5,
            // zoomDelta: 0.5
        };
    }

    point() {
        // let points = (this.user.name ? +8 : +0) + (this.facebookName ? +3 : +0) +
        //     (this.twitterName ? +3 : +0) + (this.instagramName ? +3 : +0) +
        //     (this.gender ? +5 : +0) + (this.age ? +9 : +0) + (this.income ? +9 : +0);
        // return points;temporary
        // return 0;
        return this.user.points;
    }

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
        if (this.isSelectVisible) {
            this.addMap();
        }
    }

    toggleVisibleInfo() {
        this.visibleInfo = true;
    }

    addLogo() {
        this.canSaveImg = false;
        let image = new Image();
        let options = { maximumImagesCount: 1, width: 1024, height: 1024 };
        this.imagePicker.getPictures(options)
            .then(results => {
                if (results[0] && results[0] != 'O') {
                    // this.picture_url = results[0];
                    image.src = results[0];
                    this.isCrop = true;
                    this.backAction = this.platform.registerBackButtonAction(() => {
                        if (this.isCrop) {
                            this.isCrop = false;
                            this.backAction();
                        }
                    }, 1);
                    setTimeout(() => {
                        this.cropper.setImage(image);
                        this.changeDetectorRef.detectChanges();
                    }, 500);
                }
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
                console.log(err);
            });
    }

    saveImage() {
        this.changedPicture = true;
        this.picture_url = this.dataImg.image;
        this.isCrop = false;
        this.backAction();
    }

    cancel() {
        this.isCrop = false;
        this.backAction();
    }

    handleCropping(bounds: Bounds) {
        this.croppedHeight = bounds.bottom - bounds.top;
        this.croppedWidth = bounds.right - bounds.left;
        this.canSaveImg = true;
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
            this.translate.get('TOAST.INCORRECT_EMAIL')
                .subscribe(resp => {
                    this.toast.show(resp);
                })
            return false;
        }
        else {
            return true;
        }
    }

    navTo() {
        // if (this.isEdit) {
        this.nav.pop();
        this.profile.refreshAccounts();
        // }
        // else {
        // this.nav.setRoot(TabsPage);
        // this.profile.getWithAccounts()
        //     .subscribe(resp => {
        //         this.nav.setRoot(TabsPage, { NAU: resp.accounts.NAU });
        //     });
        // }
    }

    createAccount() {
        let refreshed = false;
        if (this.navParams.get('user') && this.isCoordsChenged) {
            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationAvailable().then(result => {
                    if (!result) {
                        this.location.refreshDefaultCoords(this.coords);
                        refreshed = true;
                    }
                });
            }
            else {
                this.location.refreshDefaultCoords(this.coords);
                refreshed = true;
            }
            this.isCoordsChenged = false;
        }
        if (this.validateName(this.baseData.name) && this.validateEmail(this.baseData.email)) {
            this.baseData.latitude = this.coords.lat;
            this.baseData.longitude = this.coords.lng;
            //this.account.points = this.point(); to do
            let differenceData = DataUtils.difference(this.baseData, this.user);
            let isEmpty = _.isEmpty(differenceData);
            let promise = this.picture_url && this.changedPicture
                ? this.api.uploadImage(this.picture_url, 'profile/picture', true)
                : Promise.resolve();
            if (!isEmpty) {
                //temporary
                if (this.gender && this.gender !== this.baseGender) {
                    this.storage.set('gender', this.gender);
                }
                this.gender = this.gender ? this.gender : 'other';
                //
                this.profile.patch(differenceData, false, this.gender)//temporary parametr "gender"
                    .subscribe(() => {
                        if (!refreshed) {
                            this.location.refreshDefaultCoords(this.coords, true);
                        }
                        promise.then(() => {
                            this.navTo();
                        });
                    })
            }
            else {
                //temporary
                if (!this.gender || this.gender !== this.baseGender) {
                    if (this.gender) {
                        this.storage.set('gender', this.gender);
                    }
                    this.gender = this.gender ? this.gender : 'other';
                    this.profile.sendTags(this.user, this.gender);
                }
                //
                promise.then(() => {
                    this.navTo();
                })
            }
        }
    }

    presentAndroidConfirm() {
        this.translate.get(['CONFIRM', 'UNIT.OK'])
            .subscribe(resp => {
                let confirm = resp['CONFIRM'];
                let title = confirm['LOCATION_DENIED'];
                let message = confirm['YOU_HAVE_DENIED'];
                const alert = this.alert.create({
                    title: title,
                    message: message,
                    buttons: [{
                        text: resp['UNIT.OK'],
                        handler: () => {
                            // console.log('Application exit prevented!');
                            this.getLocation(true);
                        }
                    }]
                });
                alert.present();
            })
    }

    presentConfirm() {
        this.translate.get(['CONFIRM', 'UNIT'])
            .subscribe(resp => {
                let content = resp['CONFIRM'];
                let unit = resp['UNIT'];
                let confirm = this.alert.create({
                    title: content['LOCATION_NEEDED_PROFILE'],
                    message: content['TURN_ON_LOCATION_PROFILE'],
                    buttons: [
                        {
                            text: unit['CANCEL'],
                            handler: () => {
                                this.getLocation(true);
                                this.isSelectVisible = true;
                            }
                        },
                        {
                            text: unit['SETTINGS'],
                            handler: () => {
                                this.isConfirm = true;
                                if (this.platform.is('ios')) {
                                    this.diagnostic.switchToSettings();
                                }
                                else {
                                    this.diagnostic.switchToLocationSettings();
                                }
                            }
                        }
                    ],
                    enableBackdropDismiss: false
                });
                confirm.present();
            })
    }

    ionViewDidLeave() {
        if (this.platform.is('cordova')) {
            this.onResumeSubscription.unsubscribe();
        }
        this.isCrop = false;
        if (this.backAction) this.backAction();
    }

}
