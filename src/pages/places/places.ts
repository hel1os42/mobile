import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController, Platform, Popover, PopoverController } from 'ionic-angular';
import { DomUtil, icon, LatLng, latLng, LatLngBounds, LeafletEvent, Map, Marker, marker, popup, tileLayer } from 'leaflet';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ChildCategory } from '../../models/childCategory';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { Place } from '../../models/place';
import { RetailType } from '../../models/retailType';
import { Share } from '../../models/share';
import { Tag } from '../../models/tag';
import { AppModeService } from '../../providers/appMode.service';
import { FavoritesService } from '../../providers/favorites.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { ShareService } from '../../providers/share.service';
import { StorageService } from '../../providers/storage.service';
import { TestimonialsService } from '../../providers/testimonials.service';
import { DataUtils } from '../../utils/data.utils';
import { DistanceUtils } from '../../utils/distanse.utils';
import { PlacePage } from '../place/place';
import { PlacesPopover } from './places.popover';
import { GeocodeService } from '../../providers/geocode.service';
import { NoPlacesPopover } from '../places/noPlaces.popover';
import { COUNTRIES } from '../../const/countries';


@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    companies: Place[];
    categories: OfferCategory[] = OfferCategory.StaticList;
    childCategories: ChildCategory[];
    selectedCategory = new OfferCategory;
    isMapVisible: boolean = false;
    coords: Coords;
    mapBounds;
    mapCenter: Coords;
    message: string;
    // radius = 19849000;
    radius: number;
    segment: string;
    distanceString: string;
    search = '';
    typeFilter = [];
    specialityFilter = [];
    tagFilter = [];
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
    isChangedFilters = false;
    isForkMode: boolean;
    onResumeSubscription: Subscription;
    onRefreshListSubscription: Subscription;
    onRefreshTestimonials: Subscription;
    onRefreshDefoultCoords: Subscription;
    isConfirm = false;
    shareData: Share;
    isRefreshLoading = false;
    refresher;
    _map: Map;

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
        private translate: TranslateService,
        private diagnostic: Diagnostic,
        private share: ShareService,
        private favorites: FavoritesService,
        private storage: StorageService,
        private testimonials: TestimonialsService,
        private geocoder: GeocodeService) {

        this.isForkMode = this.appMode.getForkMode();
        this.radius = this.storage.get('radius') ? this.storage.get('radius') : 500000;

        // this.onShareSubscription = this.share.onShare
        //     .subscribe(resp => {
        //         this.shareData = resp;
        //         debugger
        //     })
        this.shareData = this.share.get();

        this.segment = "alloffers";
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
                    })
                    // .catch(err => console.log(err + 'err'));
                }
                else return;
            });
        }

        this.offers.getCategories(false)
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    category.id = categories.data.find(p => p.name === category.name).id;//temporary - code
                })
                this.selectedCategory = this.categories[0];
                this.getLocationStatus();
            })
        this.onRefreshListSubscription = this.favorites.onRefreshPlaces
            .subscribe((resp) => {
                this.companies.forEach(company => {
                    if (company.id === resp.id) {
                        company.is_favorite = resp.isFavorite;
                    }
                });
            });

        this.onRefreshTestimonials = this.testimonials.onRefresh
            .subscribe(resp => {
                if (resp.status === 'approved') {
                    this.companies.forEach(company => {
                        if (company.id === resp.place_id) {
                            // if (company.stars && company.stars > 0 && company.testimonials_count && company.testimonials_count > 0) {
                            //     company.stars = (company.stars * company.testimonials_count + resp.stars) / company.testimonials_count + 1;
                            // }
                            // else {
                            //     company.stars = resp.stars;
                            // }
                            company.testimonials_count = company.testimonials_count + 1;
                        };
                    });
                }
            });

        this.onRefreshDefoultCoords = this.location.onProfileCoordsChanged
            .subscribe(coords => {
                this.coords = coords;
                this.page = 1;
                this.loadCompanies(this.page, true);
                this.userPin = [marker([this.coords.lat, this.coords.lng], {
                    icon: icon({
                        iconSize: [22, 26],
                        iconAnchor: [13, 35],
                        iconUrl: 'assets/img/icon_user_map.svg',
                        //shadowUrl:
                    })
                })]
                // this.changeDetectorRef.detectChanges();
            })

    }

    onMapReady(map: Map) {
        if (!this._map && this.coords.lat) {
            this._map = map;
        }
    }

    getLocationStatus() {
        if (this.platform.is('android') && this.platform.is('cordova')) {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                .then(result => {
                    if (result.hasPermission === false) {
                        this.requestPerm();
                    }
                    else {
                        this.getLocation(false);
                    }
                    // console.log(result)
                }
                    // err => {
                    //     this.requestPerm();
                    //     console.log(err + 'err');
                    // }
                )
            // .catch(err => console.log(err));
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
                            })
                        // .catch(err => {
                        //     debugger;
                        //     console.log(err + 'err');
                        // });
                    }
                    else {
                        this.getLocation(false);
                    }
                    console.log(result)
                }
                // err => {
                //     this.requestPerm();
                //     debugger
                // }
            )
        // .catch(err => {
        //     debugger;
        //     console.log(err + 'err');
        // });
    }

    getLocation(isDenied: boolean, isRefresh?: boolean) {
        if (!isDenied) {
            if (!this.platform.is('cordova')) {
                this.getCoords(isRefresh);
            }
            else {
                this.diagnostic.isLocationAvailable().then(result => {
                    if (!result) {
                        if (this.platform.is('android')) {
                            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                                .then(result => {
                                    if (result.hasPermission === false) {
                                        this.requestPerm();
                                    }
                                    else {
                                        this.presentConfirm();
                                    }
                                    // console
                                })
                        }
                        if (this.platform.is('ios')) {
                            this.presentConfirm();
                        }
                    }
                    else {
                        this.getCoords(isRefresh);
                    }
                })
                // .catch(err => console.log(err + 'err'))
            }
        }
        else {
            this.profile.get(true, false)
                .subscribe(user => {
                    this.coords = {
                        lat: user.latitude,
                        lng: user.longitude
                    };
                    if (this.shareData) {
                        this.openPlace(this.shareData, true)
                    }
                    this.getCompaniesList();
                })
        }
    }

    getNativeCoords(isHighAccuracy: boolean, isRefresh?: boolean) {
        let loadingLocation = this.loading.create(!isRefresh ? { content: 'Location detection', spinner: 'bubbles' } : undefined);
        if (!this.isRefreshLoading) {
            loadingLocation.present();
        }
        this.location.get(isHighAccuracy)
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                if (this.shareData) {
                    this.openPlace(this.shareData, true)
                }
                this.getCompaniesList();
            })
            .catch((error) => {
                loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                this.presentConfirm();
                // error => console.log(error + 'err')
            })
    }

    getCoords(isRefresh?: boolean) {

        if (this.platform.is('android')) {
            this.diagnostic.getLocationMode()
                .then(res => {
                    this.getNativeCoords(res === 'high_accuracy', isRefresh);
                });
        }
        else {
            this.getNativeCoords(false, isRefresh);
        }
    }

    getDevMode() {
        return (this.appMode.getEnvironmentMode() === 'dev' || this.appMode.getEnvironmentMode() === 'test');
    }


    getCompaniesList() {
        // this.categoryFilter = [this.selectedCategory.id];
        this.loadCompanies(this.page, true);
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
            northEast.lat = northEast.lat + 0.3;
            bounds.extend(northEast);
            return bounds;
        }
        if (this._map) {
            this._map.setView(this.coords, this._map.getZoom());
        }
        return undefined;
    }

    isSelectedCategory(category: OfferCategory) {
        return this.selectedCategory && this.selectedCategory.id == category.id;
    }

    selectCategory(category: OfferCategory) {
        this.isChangedCategory = this.selectedCategory.id !== category.id;
        this.search = "";
        this.selectedCategory = category;
        this.loadCompanies(this.page = 1, true);
        if (this.isChangedCategory) {
            this.tagFilter = [];
            this.typeFilter = [];
            this.specialityFilter = [];
        }
    }

    loadCompanies(page, isRoot?: boolean) {
        let isRefreshLoading = !this.isRefreshLoading;
        let obs = isRoot ? this.offers.getPlacesOfRoot(this.selectedCategory.id, this.coords.lat, this.coords.lng, this.radius, page, isRefreshLoading)
            : this.offers.getPlaces(this.selectedCategory.id, this.tagFilter,
                this.typeFilter, this.specialityFilter, this.coords.lat, this.coords.lng,
                this.radius, this.search, page, isRefreshLoading);
        obs.subscribe(companies => {
            this.isRefreshLoading = false;
            if (this.refresher) {
                this.refresher.complete();
                this.refresher = undefined;
            }
            this.companies = companies.data;
            this.lastPage = companies.last_page;
            this.markers = [];
            this.companies.forEach((company) => {
                this.markers.push(this.createMarker(company.latitude, company.longitude, company));
            })
            if (this.companies.length == 0 && this.radius <= 250000) {
                this.noPlacesHandler();
            }
            
            //

            this.fitBounds = this.generateBounds(this.markers);
        },
            err => {
                this.isRefreshLoading = false;
                if (this.refresher) {
                    this.refresher.complete();
                    this.refresher = undefined;
                }
            });
    }

    noPlacesHandler() {
        this.geocoder.getAddress(this.coords.lat, this.coords.lng)
        .subscribe(data => {
            let address = !data.error ? data.address: undefined;
            let city = address 
            ? (address.city || address.town || address.county || address.state)
            : undefined;
            let country = address ? address.country : undefined;
            let isCountryEnabled = COUNTRIES.find(item => item === country) ? true : false;
            let popover = this.popoverCtrl.create(NoPlacesPopover, { isCountryEnabled: isCountryEnabled, city: city, country: country });
            popover.present();
            debugger
            // this.changeDetectorRef.detectChanges();
        })
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

    openPlace(data, isShare?: boolean) {
        let params;
        if (isShare) {
            params = {
                ...data,
                coords: this.coords,
            }
        }
        else {
            params = {
                company: data,
                distanceObj: this.getDistance(data.latitude, data.longitude),
                coords: this.coords,
            }
        }
        this.nav.push(PlacePage, params);
        // .then(() => {
        //     this.onRefreshList = this.favorites.onRefreshPlaces
        //         .subscribe((resp) => {
        //             this.companies.forEach(company => {
        //                 if (company.id === resp.id) {
        //                     company.is_favorite = resp.isFavorite;
        //                 }
        //             })
        //         })
        // });
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
            let long = DistanceUtils.getDistanceFromLatLon(this.coords.lat, this.coords.lng, latitude, longitude);
            let distance = long >= 1000 ? long / 1000 : long;
            let key = long >= 1000 ? 'UNIT.KM' : 'UNIT.M';
            return {
                distance: distance,
                key: key
            }
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
                    this.presentPopover();
                });
        }
        else {
            this.presentPopover();
        }
        this.isChangedCategory = false;
    }

    presentPopover() {
        let popover = this.popoverCtrl.create(PlacesPopover, {
            types: this.selectedTypes,
            tags: this.selectedTags,
            radius: this.radius
        });
        this.search = "";
        if (this.platform.is('ios')) {
            setTimeout(() => {
                popover.present();
            }, 300)
        }
        else {
            popover.present();
        }
        popover.onDidDismiss((data) => {
            if (!data) {
                return;
            }
            else {
                this.radius = data.radius;
                this.storage.set('radius', this.radius);

                let types = data.types.filter(t => t.isSelected);
                let tags = data.tags.filter(p => p.isSelected);
                if (types.length > 0 && this.getFilter(this.selectedTypes, data.types)) {
                    this.selectedTypes = data.types;
                    this.typeFilter = data.types.filter(p => p.isSelected).map(p => p.id);
                    this.isChangedFilters = true;
                }
                else if (types.length == 0 && this.selectedTypes.length > 0) {
                    this.selectedTypes.forEach(type => {
                        type.isSelected = false;
                    });
                    this.typeFilter = [];
                }
                if (tags.length > 0 && this.getFilter(this.selectedTags, data.tags)) {
                    this.selectedTags = data.tags;
                    this.tagFilter = data.tags.filter(p => p.isSelected).map(p => p.slug);
                    this.isChangedFilters = true;
                }
                else if (tags.length == 0 && this.selectedTags) {
                    this.selectedTags.forEach(type => {
                        type.isSelected = false;
                    });
                    this.tagFilter = [];
                }
                if (data.specialities.length > 0 && this.specialityFilter !== data.specialities) {
                    this.specialityFilter = data.specialities.map(p => p.slug);
                    this.isChangedFilters = true;
                }
                else if (data.specialities.length == 0) {
                    this.specialityFilter = [];
                }
                this.loadCompanies(this.page = 1);
            }
        })
    }

    getFilter(arr, newArr) {
        let isDiff;
        for (let i = 0; i < arr.length; i++) {
            for (let k = 0; k < newArr.length; k++) {
                let d = !_.isEmpty(DataUtils.difference(arr[i], newArr[k]));
                if (d) {
                    isDiff = true;
                }
            }
        }
        return isDiff;
    }

    searchCompanies($event) {
        this.loadCompanies(this.page = 1);
    }

    infiniteScroll(infiniteScroll) {
        this.page = this.page + 1;
        if (this.page <= this.lastPage) {
            setTimeout(() => {
                this.offers.getPlaces(this.selectedCategory.id, this.tagFilter,
                    this.typeFilter, this.specialityFilter, this.coords.lat, this.coords.lng,
                    this.radius, this.search, this.page, this.page == 1)
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

    doRefresh(refresher) {
        this.page = 1;
        this.isRefreshLoading = true;
        this.getLocation(false, true);
        this.refresher = refresher;
        // setInterval(() => {
        //     refresher.complete();

        // }, 300);
    }

    presentAndroidConfirm() {
        this.translate.get(
            ['PAGE_PLACES', 'UNIT'])
            .subscribe(resp => {
                let places = resp['PAGE_PLACES'];
                let unit = resp['UNIT'];
                const alert = this.alert.create({
                    title: unit['DETECTING_YOUR_LOCATION'],
                    message: places['YOU_HAVE_DENIED_ACCESS'],
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            // console.log('Application exit prevented!');
                            alert.dismiss().then(() => {
                                this.getLocation(true);
                            })
                                .catch(err => console.log(err));

                        }
                    }]
                });
                alert.present();
            })
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
        });
        confirm.present();
    }

    ngOnDestroy() {
        if (this.platform.is('cordova')) {
            this.onResumeSubscription.unsubscribe();
        }
        if (this.onRefreshListSubscription) {
            this.onRefreshListSubscription.unsubscribe();
        }
        this.onRefreshTestimonials.unsubscribe();
    }

    ionViewDidLoad() {
        //let imgEl: HTMLElement = document.getElementsByClassName('test')[0].getElementsByClassName('scroll-content')[0];
        //imgEl.style.marginBottom = '0'
    }
}
