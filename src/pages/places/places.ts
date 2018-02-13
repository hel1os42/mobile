import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LoadingController, NavController, Platform, Popover, PopoverController, IonicApp, App } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DomUtil, icon, LatLng, latLng, LatLngBounds, LeafletEvent, Marker, marker, popup, tileLayer, Map } from 'leaflet';
import { ChildCategory } from '../../models/childCategory';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { Place } from '../../models/place';
import { RetailType } from '../../models/retailType';
import { SelectedCategory } from '../../models/selectedCategory';
import { Tag } from '../../models/tag';
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { DistanceUtils } from '../../utils/distanse';
import { PlacePage } from '../place/place';
import { PlacesPopover } from './places.popover';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    companies: Place[];
    categories: OfferCategory[] = OfferCategory.StaticList;
    childCategories: ChildCategory[];
    selectedChildCategories: SelectedCategory[];
    selectedCategory = new OfferCategory;
    isMapVisible: boolean = false;
    coords: Coords;
    mapBounds;
    mapCenter: Coords;
    message: string;
    radius = 19849000;
    segment: string;
    distanceString: string;
    search = '';
    categoryFilter: string[];
    page = 1;
    lastPage: number;
    tileLayer;
    options;
    markers: Marker[];
    userPin: Marker[];
    fitBounds;
    selectedTypes: RetailType[];
    selectedTags: Tag[];
    isChangedCategory = true;
    isForkMode;
    onResumeSubscription: Subscription;
    isConfirm = false;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private offers: OfferService,
        private popoverCtrl: PopoverController,
        private loading: LoadingController,
        private profile: ProfileService,
        private alert: AlertController,
        private androidPermissions: AndroidPermissions,
        private diagnostic: Diagnostic) {

        this.isForkMode = this.appMode.getForkMode();
        this.segment = "alloffers";
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

        this.offers.getCategories(false)
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    category.id = categories.data.find(p => p.name == category.name).id;//temporary - code
                })
                this.selectedCategory = this.categories[0];

                if (this.platform.is('android')) {
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
                if (this.platform.is('ios') || !this.platform.is('android')) {
                    this.getLocation(false);
                }
            })
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
            this.profile.get(true, false)
                .subscribe(user => {
                    this.coords = {
                        lat: user.latitude,
                        lng: user.longitude
                    };
                    this.getCompaniesList();
                })
        }
    }

    getCoords() {
        let loadingLocation = this.loading.create({ content: 'Location detection', spinner: 'bubbles' });
        loadingLocation.present();
        if (this.platform.is('android')) {
            this.diagnostic.getLocationMode()
                .then(res => {
                    this.location.get(res === 'high_accuracy')
                        .then((resp) => {
                            this.coords = {
                                lat: resp.coords.latitude,
                                lng: resp.coords.longitude
                            };
                            loadingLocation.dismissAll();
                            this.getCompaniesList();
                        })
                        .catch((error) => {
                            loadingLocation.dismissAll();
                            this.presentConfirm();
                        });
                });
        }
        else {
            this.location.get(false)
                .then((resp) => {
                    loadingLocation.dismissAll();
                    this.coords = {
                        lat: resp.coords.latitude,
                        lng: resp.coords.longitude
                    };
                    this.getCompaniesList();
                })
                .catch((error) => {
                    loadingLocation.dismissAll();
                    this.presentConfirm();
                });
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

    getDevMode() {
        return (this.appMode.getEnvironmentMode() === 'dev' || this.appMode.getEnvironmentMode() === 'test');
    }

    getCompaniesList() {
        this.categoryFilter = [this.selectedCategory.id];
        this.loadCompanies([this.selectedCategory.id], this.search, this.page);
        this.addMap();
        this.userPin = [marker([this.coords.lat, this.coords.lng], {
            icon: icon({
                iconSize: [22, 26],
                iconAnchor: [13, 35],
                iconUrl: 'assets/img/icon_user_map.svg',
                //shadowUrl:
            })
        })]
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            maxNativeZoom: 18,
            minZoom: 1,
            attribution: '© OpenStreetMap',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true
        });
        this.options = {
            zoom: 16,
            center: latLng(this.coords)
        };
    }

    getLayers() {
        return [
            this.tileLayer,
            ...this.markers,
            ...this.userPin,
        ]
    }

    createMarker(lat, lng, company: Place) {
        let markerLayer = marker([lat, lng], {
            icon: icon({
                iconSize: [24, 30],
                iconAnchor: [13, 35],
                iconUrl: 'assets/img/create_user_profile/pin.svg',
                //shadowUrl:
            })
        });

        let popupContent = DomUtil.create('div');
        popupContent.innerText = company.name;
        popupContent.addEventListener('click', (event) => {
            this.openPlace(company);
        });
        let popupLayer = popup().setContent(popupContent);

        markerLayer.bindPopup(popupLayer);

        markerLayer.on('click', (event: LeafletEvent) => {
            console.log(company);
        });

        return markerLayer;
    }

    generateBounds(markers: Marker[]): any {
        if (markers && markers.length > 0) {
            let latLngPairs = markers.map(p => p.getLatLng());
            let bounds = new LatLngBounds(this.coords, this.coords);
            latLngPairs.forEach((latLng: LatLng) => {
                bounds.extend(latLng);
            });
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                return bounds;
            }
            let northEast = bounds.getNorthEast();
            northEast.lat = northEast.lat + 0.2;
            bounds.extend(northEast);
            return bounds;
        }
        return undefined
    }

    ionSelected() {
        this.appMode.setHomeMode(false);
    }

    isSelectedCategory(category: OfferCategory) {
        return this.selectedCategory && this.selectedCategory.id == category.id;
    }

    selectCategory(category: OfferCategory) {
        this.isChangedCategory = this.selectedCategory.id !== category.id;
        this.search = ""
        this.selectedCategory = category;
        this.loadCompanies([this.selectedCategory.id], this.search, this.page = 1);
        this.categoryFilter = [this.selectedCategory.id];
    }

    loadCompanies(categoryId, search, page) {
        this.offers.getPlaces(categoryId, this.coords.lat, this.coords.lng, this.radius, search, page)
            .subscribe(companies => {
                this.companies = companies.data;
                this.markers = [];
                this.companies.forEach((company) => {
                    this.markers.push(this.createMarker(company.latitude, company.longitude, company));
                })
                this.fitBounds = this.generateBounds(this.markers);
            });
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;

        function renderMap() {
            if (document.getElementById("map_leaf")) {
                document.getElementById("map_leaf").style.height = window.innerHeight -
                    document.getElementsByClassName('grid-tabs-splash')[0].clientHeight -
                    document.getElementsByClassName('tabbar')[0].clientHeight -
                    document.getElementsByClassName('sticky')[0].clientHeight + "px";
            }
        }
        setTimeout(renderMap, 1);
    }

    openPlace(company: Place) {
        this.nav.push(PlacePage, {
            company: company,
            distanceStr: this.getDistance(company.latitude, company.longitude),
            coords: this.coords,
            features: company.specialities
        });
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {
        if (this.coords) {
            let distance = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, latitude, longitude);
            this.distanceString = distance >= 1000 ? distance / 1000 + " km" : distance + " m";
            return this.distanceString;
        };
        return undefined;
    }

    createPopover() {
        let popover: Popover;
        if (this.isChangedCategory) {
            this.offers.getTypes(this.selectedCategory.id)
                .subscribe(resp => {
                    this.selectedTypes = resp.retail_types.map(type => {
                        let selectedSpecialities = type.specialities;
                        return {
                            ...type,
                            specialities: selectedSpecialities
                                .map(item => {
                                    return {
                                        ...item,
                                        isSelected: false
                                    }
                                }),
                            isSelected: false
                        }
                    });
                    this.selectedTags = resp.tags.length > 0
                        ? resp.tags.map(item => {
                            return {
                                ...item,
                                isSelected: false
                            }
                        })
                        : undefined;
                    popover = this.popoverCtrl.create(PlacesPopover, { types: this.selectedTypes, tags: this.selectedTags });
                    this.presentPopover(popover);
                });
        }
        else {
            popover = this.popoverCtrl.create(PlacesPopover, { types: this.selectedTypes, tags: this.selectedTags });
            this.presentPopover(popover);
        }
    }

    presentPopover(popover) {
        this.search = "";
        popover.present();
        popover.onDidDismiss((data) => {
            if (!data) {
                return;
            }
            let selectedCategories: SelectedCategory[] = data.categories.filter(p => p.isSelected);
            if (selectedCategories.length > 0) {
                this.selectedChildCategories = selectedCategories;
                this.categoryFilter = this.selectedChildCategories.map(p => p.id);
            }
            else {
                this.selectedChildCategories = undefined;
                this.categoryFilter = [this.selectedCategory.id];
            }
            this.loadCompanies(this.categoryFilter, this.search, this.page = 1);
        })
    }

    searchCompanies($event) {
        this.loadCompanies(this.categoryFilter, this.search, this.page = 1);
    }

    infiniteScroll(infiniteScroll) {
        this.page = this.page + 1;
        if (this.page <= this.lastPage) {
            setTimeout(() => {
                this.offers.getPlaces(this.categoryFilter, this.coords.lat, this.coords.lng, this.radius, this.search, this.page)
                    .subscribe(companies => {
                        this.companies = [...this.companies, ...companies.data];
                        this.lastPage = companies.last_page;
                        this.markers = [];
                        this.companies.forEach((company) => {
                            this.markers.push(this.createMarker(company.latitude, company.longitude, company));
                        })
                        this.fitBounds = this.generateBounds(this.markers);
                        infiniteScroll.complete();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }

    presentAndroidConfirm() {
        const alert = this.alert.create({
            title: 'Location denied',
            message: 'You have denied access to geolocation. Set your coordinates in manual mode.',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    // console.log('Application exit prevented!');
                    this.getLocation(true);
                }
            }]
        });
        alert.present();
    }

    presentConfirm() {
        let confirm = this.alert.create({
            title: 'Your location needed for the correct operation of the application',
            message: 'To turn on location, please, click "Settings". Otherwise, the coordinates will be taken from your profile. (To update the coordinates, update your profile.)',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        this.getLocation(true);
                    }
                },
                {
                    text: 'Settings',
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
        },
        );
        confirm.present();
    }

    ionViewDidLeave() {
        this.onResumeSubscription.unsubscribe();
    }
}
