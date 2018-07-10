import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController, Platform, PopoverController, Content } from 'ionic-angular';
import { DomUtil, icon, LatLng, latLng, LeafletEvent, Map, Marker, marker, popup, tileLayer, Circle, CircleMarkerOptions } from 'leaflet';
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
import { DistanceUtils } from '../../utils/distanse.utils';
import { PlacePage } from '../place/place';
import { PlacesPopover } from './places.popover';
import { GeocodeService } from '../../providers/geocode.service';
import { NoPlacesPopover } from '../places/noPlaces.popover';
import { COUNTRIES } from '../../const/countries';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { MapUtils } from '../../utils/map.utils';
import { AnalyticsService } from '../../providers/analytics.service';
import { Offer } from '../../models/offer';
import { LimitationPopover } from '../place/limitation.popover';
import { User } from '../../models/user';
import { AdjustService } from '../../providers/adjust.service';
import { LinkPopover } from '../offer/link.popover';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    @ViewChild(Content) content: Content;

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
    listRadius: number;
    mapRadius: number;
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
    onRefreshFeaturedOffers: Subscription;
    onRefreshUser: Subscription;
    isConfirm = false;
    shareData: Share;
    isRefreshLoading = false;
    refresher;
    _map: Map;
    circle: Circle;
    circleRadius = 10000;
    isRevertCoords = false;
    userCoords: Coords;
    zoom = 16;
    isDismissNoPlacesPopover = true;
    isFeatured = false;
    featuredOffers: Offer[];
    featuredPage = 1;
    lastFeaturedPage: number;
    user: User;
    isDismissLinkPopover = true;

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
        private geocoder: GeocodeService,
        private gAnalytics: GoogleAnalytics,
        private analytics: AnalyticsService,
        private changeDetectorRef: ChangeDetectorRef,
        private adjust: AdjustService,
        private browser: InAppBrowser) {

        this.isForkMode = this.appMode.getForkMode();
        this.mapRadius = this.listRadius = this.radius = this.storage.get('radius') ? this.storage.get('radius') : 500000;

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

        this.offers.getCategories(true)
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    let obj = categories.data.find(p => p.name === category.name);//temporary - code
                    category.id = obj ? obj.id : '';
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
                            // company.testimonials_count = company.testimonials_count + 1;
                        };
                    });
                }
            });

        this.onRefreshFeaturedOffers = this.offers.onRefreshFeaturedOffers
            .subscribe(resp => {
                this.featuredOffers = resp.data;
                this.featuredPage = 1;
                this.lastFeaturedPage = resp.last_page;
            })

        this.onRefreshUser = this.profile.onRefresh
            .subscribe(user => this.user = user)

        this.onRefreshDefoultCoords = this.location.onProfileCoordsChanged
            .subscribe(coords => {
                this.userCoords = {
                    lat: coords.lat,
                    lng: coords.lng
                };
                this.coords = coords;
                this.page = 1;
                this.loadCompanies(true, this.page);
                this.userPin = [marker([this.userCoords.lat, this.userCoords.lng], {
                    icon: icon({
                        iconSize: [22, 26],
                        iconAnchor: [13, 35],
                        iconUrl: 'assets/img/icon_user_map.svg',
                        //shadowUrl:
                    })
                })]
                this.changeDetectorRef.detectChanges();
            })

    }

    onMapReady(map: Map) {
        // console.log(map);
        // let width = this.platform.width();
        let heigth = document.getElementById("map_leaf").offsetHeight;
        if (!this._map && this.coords.lat) {
            this._map = map;
            this.generateBounds(this.markers);
        }
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.zoom = this._map.getZoom();
                if (this.coords.lat != this._map.getCenter().lat) {
                    this.coords = this._map.getCenter();
                    // this.changeDetectorRef.detectChanges();
                    if (this.coords.lng > 180 || this.coords.lng < -180) {
                        this.coords.lng = MapUtils.correctLng(this.coords.lng);
                        this._map.panTo(this.coords);
                        // this._map.setView(this.coords, this._map.getZoom());
                    };
                    this.mapCenter = {
                        lat: this.coords.lat,
                        lng: this.coords.lng
                    };
                    // this._map.panTo(this.coords);
                    let radius = MapUtils.getRadius(heigth / 2, this._map);
                    this.mapRadius = this.radius = Math.round(radius);
                    this.changeDetectorRef.detectChanges();
                    this.loadCompanies(false, 1, true);
                }
            }
        })
    }

    revertedLocation() {
        this.isRevertCoords = true;
        this.getLocationStatus();
        // this._map.setView(this.coords, this.zoom);
    }

    getLocationStatus() {
        if (this.platform.is('cordova') && this.platform.is('android')) {
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
        else if (this.platform.is('cordova') && this.platform.is('ios')) {
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
                    if (user.latitude) {
                        this.getDefaultCoords(user.latitude, user.longitude);
                    }
                    else {
                        this.location.getByIp()
                            .subscribe(resp => {
                                // this.getDefaultCoords(resp.latitude, resp.longitude);
                                // user.latitude = resp.latitude;
                                // user.longitude = resp.longitude;
                                this.getDefaultCoords(resp.lat, resp.lon);
                                this.user.latitude = resp.lat;
                                this.user.longitude = resp.lon;
                                this.profile.patch({ latitude: this.user.latitude, longitude: this.user.longitude }, true);
                            },
                                err => {
                                    this.getDefaultCoords(0, 0);
                                    this.user.latitude = 0;
                                    this.user.longitude = 0;
                                    this.profile.patch({ latitude: this.user.latitude, longitude: this.user.longitude }, true);
                                });
                    }
                })
        }
    }

    getNativeCoords(isHighAccuracy: boolean, isRefresh?: boolean) {
        this.translate.get('TOAST.LOCATION_DETECTION')
            .subscribe(resp => {
                let loadingLocation;
                if (!this.isRefreshLoading) {
                    loadingLocation = this.loading.create(
                        !isRefresh ?
                            {
                                content: resp,
                                spinner: 'bubbles'
                            }
                            : undefined);
                    loadingLocation.present();
                }
                // this.location.get(isHighAccuracy)
                // .then((resp) => {
                //     this.getDefaultCoords(resp.coords.latitude, resp.coords.longitude);
                //     loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                // })
                // .catch((error) => {
                //     loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                //     if (this.platform.is('cordova')) {
                //     }
                //     else {
                //         this.getLocation(true);
                //     }
                //     // error => console.log(error + 'err')
                // })
                if (this.platform.is('cordova')) {
                    this.location.get(isHighAccuracy)
                        .then((resp) => {
                            this.getDefaultCoords(resp.coords.latitude, resp.coords.longitude);
                            if (loadingLocation) {
                                loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                            }
                        })
                        .catch((error) => {
                            if (loadingLocation) {
                                loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                            }
                            this.presentConfirm();
                        })
                }
                //for browser
                else {
                    if (loadingLocation) {
                        loadingLocation.dismiss().catch((err) => { console.log(err + 'err') });
                    }
                    this.getLocation(true);
                }
                //
            })
    }

    getDefaultCoords(lat: number, lng: number) {
        this.userCoords = {
            lat: lat,
            lng: lng
        };
        this.coords = {
            lat: lat,
            lng: lng
        };
        if (this.isRevertCoords) {
            // this._map.setView(this.coords, this.zoom);
            this._map.panTo(this.coords);
            this.isRevertCoords = false;
        }
        if (!this.shareData) {
            this.shareData = this.share.get();
        }
        if (this.shareData) {
            this.openPlace(undefined, this.shareData, true);
        }
        this.getList();
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

    getList() {
        if (this.isFeatured) {
            this.loadFeaturedOffers();
        }
        else {
            this.addMap();
            this.loadCompanies(true, this.page);
            this.userPin = [marker([this.userCoords.lat, this.userCoords.lng], {
                icon: icon({
                    iconSize: [40, 50],
                    iconAnchor: [20, 50],
                    // iconUrl: 'assets/img/icon_user_map.svg',
                    iconUrl: 'assets/img/user_home/pin_user.svg',
                    //shadowUrl:
                })
            })]
        }
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            maxNativeZoom: 18,
            minZoom: 1.5,
            attribution: '© OpenStreetMap',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
            circle: this.circle
        });
        this.options = {
            layer: [this.tileLayer],
            zoom: this.zoom,
            center: latLng(this.coords),
            zoomSnap: 0.5,
            zoomDelta: 0.5
        };
    }

    getLayers() {
        return [
            this.tileLayer,
            ...this.markers,
            ...this.userPin,
            // ...[this.circle]
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
            this.openPlace(undefined, company, false);
        });
        let popupLayer = popup().setContent(popupContent);

        markerLayer.bindPopup(popupLayer);

        markerLayer.on('click', (event: LeafletEvent) => {
            console.log(company);
        });

        return markerLayer;
    }

    generateBounds(markers: Marker[]): any {
        //     if (markers && markers.length > 0) {
        //         let latLngPairs = markers.map(p => p.getLatLng());
        //         let bounds = new LatLngBounds(this.coords, this.coords);
        //         latLngPairs.forEach((latLng: LatLng) => {
        //             bounds.extend(latLng);
        //         });
        //         if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        //             return bounds;
        //         }
        //         let northEast = bounds.getNorthEast();
        //         northEast.lat = northEast.lat + 0.3;
        //         bounds.extend(northEast);
        //         return bounds;
        //     }
        //     if (this._map) {
        //         this._map.setView(this.coords, this._map.getZoom());
        //     }
        //     return undefined;
        if (this._map && this.isMapVisible) {
            let distance: number;
            if (markers && markers.length > 0) {
                let latLngPairs = markers.map(p => p.getLatLng());
                let distanceArr = [];
                latLngPairs.forEach((latLng: LatLng) => {
                    distanceArr.push(this._map.distance(this.coords, latLng))
                });
                distance = _.max(distanceArr);
                this.circleRadius = distance;
                if (this.circle) {
                    this.circle.remove();
                    this.circle = undefined;
                }
                let options: CircleMarkerOptions = {
                    stroke: false,
                    fill: false
                }
                this.circle = new Circle(this.coords, distance, options).addTo(this._map);
                this.fitBounds = this.circle.getBounds();
                // let zoom = this._map.getBoundsZoom(this.fitBounds);
                this.changeDetectorRef.detectChanges();
            }
            else {
                distance = this.circleRadius;
            }

        }
    }

    isSelectedCategory(category: OfferCategory, i: number) {
        return this.selectedCategory && this.selectedCategory.id === category.id && !this.isFeatured;
    }

    selectCategory(category: OfferCategory) {
        // this.content.scrollToTop();
        if (this.isFeatured) {
            this.isFeatured = false;
            this.content.resize();
        }
        this.isChangedCategory = this.selectedCategory.id !== category.id;
        if (this.isChangedCategory) {
            this.tagFilter = [];
            this.typeFilter = [];
            this.specialityFilter = [];
        }
        this.search = "";
        this.selectedCategory = category;
        this.loadCompanies(true, this.page = 1);

    }

    getFeatured() {
        this.adjust.setEvent('TOP_OFFERS_FEED_VISIT');
        this.featuredPage = 1;
        let loading;
        this.isFeatured = true;
        this.content.resize();
        if (!this.user) {
            loading = this.loading.create();
            loading.present();
            this.profile.get(true, false)
                .subscribe(user => {
                    this.user = user;
                    this.loadFeaturedOffers(loading);
                })
        }
        else {
            this.loadFeaturedOffers();
        }
    }

    loadFeaturedOffers(loading?: any) {
        //let radius = 19849 * 1000;
        this.offers.getFeaturedList(this.coords.lat, this.coords.lng, this.featuredPage, !this.isRefreshLoading && !loading)
            .subscribe(resp => {
                this.featuredOffers = resp.data;
                this.lastFeaturedPage = resp.last_page;
                this.isRefreshLoading = false;
                if (this.refresher) {
                    this.refresher.complete();
                    this.refresher = undefined;
                }
                if (loading) loading.dismiss();
            },
                err => {
                    this.isRefreshLoading = false;
                    if (this.refresher) {
                        this.refresher.complete();
                        this.refresher = undefined;
                    }
                    if (loading) loading.dismiss();
                });
    }

    loadCompanies(isHandler: boolean, page, isNoBounds?: boolean) {
        if (this.isDismissNoPlacesPopover) {
            this.isDismissNoPlacesPopover = false;
            let loading = !this.isRefreshLoading && !this.isMapVisible;
            let obs = ((this.tagFilter && this.tagFilter.length > 0) || this.typeFilter.length > 0 || this.specialityFilter.length > 0 || this.search !== '')
                ? this.offers.getPlaces(this.selectedCategory.id, this.tagFilter,
                    this.typeFilter, this.specialityFilter, this.coords.lat, this.coords.lng,
                    this.radius, this.search, page, loading)
                : this.offers.getPlacesOfRoot(this.selectedCategory.id, this.coords.lat, this.coords.lng, this.radius, page, loading);

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
                // if (this.companies.length == 0 && isHandler && !this.isMapVisible) {
                if (this.companies.length == 0 && isHandler) {
                    this.noPlacesHandler();
                    this.isDismissNoPlacesPopover = false;
                }
                if (this.companies.length > 0 || this.companies.length == 0 && !isHandler) {
                    this.isDismissNoPlacesPopover = true;
                }
                // this.fitBounds = this.generateBounds(this.markers);
                if (!isNoBounds) {
                    this.generateBounds(this.markers);
                }
            },
                err => {
                    this.isRefreshLoading = false;
                    if (this.refresher) {
                        this.refresher.complete();
                        this.refresher = undefined;
                    }
                });
        }
    }

    noPlacesHandler() {
        this.geocoder.getAddress(this.coords.lat, this.coords.lng, true, true)
            .subscribe(data => {
                let address = !data.error ? data.address : undefined;
                let city = address
                    // ? (address.city || address.town || address.county || address.state)
                    // ? (address.city || address.town)
                    ? address.city
                    : undefined;
                // let state = address
                //     ? (address.state || address.county)
                //     : undefined;
                let countryCode = address ? address.country_code : undefined;
                let isCountryEnabled;
                if (countryCode) {
                    let country = PHONE_CODES.find(country => country.code === countryCode.toUpperCase()).name;
                    isCountryEnabled = COUNTRIES.find(item => item.name === country) ? true : false;
                }
                else {
                    isCountryEnabled = false;
                }
                let isFiltered = (this.tagFilter && this.tagFilter.length > 0) || this.typeFilter.length > 0 || this.specialityFilter.length > 0 || this.search !== ''
                    ? true : false;

                let popover = this.popoverCtrl.create(
                    NoPlacesPopover,
                    {
                        isCountryEnabled: isCountryEnabled,
                        city: city,
                        countryCode: countryCode,
                        isFiltered: isFiltered
                    });
                popover.present();
                popover.onDidDismiss(data => {
                    if (data && data.radius) {
                        this.page = 1;
                        // this.radius = data.radius;
                        if (this.isMapVisible) {
                            this.radius = this.mapRadius = data.radius;
                        }
                        else {
                            this.radius = this.listRadius = data.radius;
                        }
                        //to test
                        this.tagFilter = [];
                        this.typeFilter = [];
                        this.specialityFilter = [];
                        this.search = '';
                        //
                        this.isDismissNoPlacesPopover = true;
                        this.loadCompanies(true, this.page);
                    }
                    this.isDismissNoPlacesPopover = true;
                })
                // this.changeDetectorRef.detectChanges();
            })
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;
        this.changeDetectorRef.detectChanges();
        if (this.isMapVisible) {
            if (!this.mapCenter) {
                this.generateBounds(this.markers);
            }
            else {
                this.radius = this.mapRadius;
                this.coords = this.mapCenter;
                this.loadCompanies(false, 1, true);
                this._map.setView(this.mapCenter, this.zoom);
                // this.changeDetectorRef.detectChanges();
            }
        }
        else {
            this.companies = [];
            this.coords = this.userCoords;
            this.radius = this.listRadius;
            this.loadCompanies(true, 1, true);
        }
        function renderMap() {
            if (document.getElementById("map_leaf")) {
                document.getElementById("map_leaf").style.height = window.innerHeight -
                    document.getElementsByClassName('block-places-header')[0].clientHeight -
                    document.getElementsByClassName('tabbar')[0].clientHeight + "px";
            }
        }
        setTimeout(renderMap, 1);
    }

    openPlace(event, data, isShare: boolean, offer?: Offer) {
        if (this.isFeatured) {
            this.adjust.setEvent('TOP_OFFER_FEED_CLICK');
        }
        else {
            this.gAnalytics.trackEvent(this.appMode.getEnvironmentMode(), 'event_chooseplace');
            this.analytics.faLogEvent('event_chooseplace');
        }

        let params;
        if (isShare) {
            params = {
                ...data,
                coords: this.userCoords,
            }
        }
        else {
            params = {
                company: data,
                distanceObj: this.getDistance(data.latitude, data.longitude),
                coords: this.userCoords,
            }
        }
        if (this.user && this.user.id) {
            params.user = this.user;
        }
        if (offer && offer.redemption_access_code) {

            let limitationPopover = this.popoverCtrl.create(LimitationPopover, { offer: offer, user: this.user });
            limitationPopover.present();
        }
        else {
            if (offer && event && event.target.localName === 'a') {
                this.openLinkPopover(event);
            }
            else {
                this.nav.push(PlacePage, params);
            }

        }
    }

    openLinkPopover(event) {
        if (this.isDismissLinkPopover) {
            this.isDismissLinkPopover = false;
            let host: string = event.target.host;
            let href: string = event.target.href;
            if (host === 'api.nau.io' || host === 'api-test.nau.io' || host === 'nau.toavalon.com') {
                event.target.href = '#';
                let endpoint = href.split('places')[1];
                this.offers.getLink(endpoint)
                    .subscribe(link => {
                        event.target.href = href;
                        let linkPopover = this.popoverCtrl.create(LinkPopover, { link: link });
                        linkPopover.present();
                        linkPopover.onDidDismiss(() => this.isDismissLinkPopover = true);
                    })
            }
            else {
                this.browser.create(href, '_system');
            }
        }
        else return;
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {
        if (this.userCoords) {
            let long = DistanceUtils.getDistanceFromLatLon(this.userCoords.lat, this.userCoords.lng, latitude, longitude);
            let distance = long >= 1000 ? long / 1000 : long;
            let key = long >= 1000 ? 'UNIT.KM' : 'UNIT.M';
            return {
                distance: distance,
                key: key
            }
        };
        return undefined;
    }

    getRadius() {
        let distance = this.mapRadius >= 1000 ? Math.round(this.mapRadius / 1000) : this.mapRadius;
        let key = this.mapRadius >= 1000 ? 'UNIT.KM' : 'UNIT.M';
        return {
            distance: distance,
            key: key
        }
    }

    createPopover() {
        if (this.selectedCategory.id) {
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
        else return;
    }

    presentPopover() {
        let popover = this.popoverCtrl.create(PlacesPopover, {
            types: _.cloneDeep(this.selectedTypes),
            tags: _.cloneDeep(this.selectedTags),
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
                let types = data.types.filter(t => t.isSelected);
                let tags = data.tags.filter(p => p.isSelected);
                if (types.length > 0 && this.getFilter(this.selectedTypes, data.types)) {
                    this.selectedTypes = data.types;
                    this.typeFilter = data.types.filter(p => p.isSelected).map(p => p.id);
                    this.isChangedFilters = true;
                }
                else if (types.length == 0 && this.typeFilter.length > 0) {
                    this.selectedTypes.forEach(type => {
                        type.isSelected = false;
                        type.specialities.forEach(speciality => speciality.isSelected = false);
                    });
                    this.typeFilter = [];
                    this.isChangedFilters = true;
                }
                if (tags.length > 0 && this.getFilter(this.selectedTags, data.tags)) {
                    this.selectedTags = data.tags;
                    this.tagFilter = data.tags.filter(p => p.isSelected).map(p => p.slug);
                    this.isChangedFilters = true;
                }
                else if (tags.length == 0 && this.tagFilter && this.tagFilter.length > 0) {
                    this.selectedTags.forEach(tag => {
                        tag.isSelected = false;
                    });
                    this.tagFilter = [];
                    this.isChangedFilters = true;
                }
                if (data.specialities.length > 0 && this.getFilter(this.specialityFilter, data.specialities, true)) {
                    this.specialityFilter = data.specialities.map(p => p.slug);
                    this.isChangedFilters = true;
                }
                else if (data.specialities.length == 0 && this.specialityFilter.length > 0) {
                    this.specialityFilter = [];
                    this.isChangedFilters = true;
                }
                if (this.isChangedFilters || this.radius != data.radius) {
                    this.radius = data.radius;
                    this.storage.set('radius', this.radius);
                    this.isChangedFilters = false;
                    this.loadCompanies(true, this.page = 1);
                }
            }
        })
    }

    getFilter(arr, newArr, isSpecialities?: boolean) {
        if (arr.length != newArr.length) {
            return true;
        }
        else {
            let counter = 0;
            for (let i = 0; i < arr.length; i++) {
                for (let k = 0; k < newArr.length; k++) {
                    if (isSpecialities) {
                        if (arr[i] === newArr[i].slug) {
                            counter++;
                        }
                    }
                    else {
                        if (arr[i].id === newArr[i].id && arr[i].isSelected === newArr[i].isSelected) {
                            counter++;
                        }
                    }

                }
            }
            return counter != arr.length * newArr.length;
        }
    }

    searchCompanies($event) {
        this.loadCompanies(true, this.page = 1);
    }

    isInfiniteScroll() {
        return !this.isMapVisible && (this.isFeatured ? this.featuredPage <= this.lastFeaturedPage : this.page <= this.lastPage);
    }

    infiniteScroll(infiniteScroll) {
        let page: number;
        let lastPage: number;
        if (this.isFeatured) {
            page = ++this.featuredPage;
            lastPage = this.lastFeaturedPage;
        }
        else {
            page = ++this.page;
            lastPage = this.lastPage;
        }
        if (page <= lastPage) {
            setTimeout(() => {
                if (this.isFeatured) {
                    // let radius = 19849 * 1000;
                    this.offers.getFeaturedList(this.coords.lat, this.coords.lng, this.featuredPage, this.featuredPage == 1)
                        .subscribe(resp => {
                            this.featuredOffers = [...this.featuredOffers, ...resp.data];
                            this.lastFeaturedPage = resp.last_page;
                            infiniteScroll.complete();
                        });
                }
                else {
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
                            this.generateBounds(this.markers);
                            infiniteScroll.complete();
                        });
                }
            });
        }
        else {
            infiniteScroll.complete();
        }
    }

    doRefresh(refresher) {
        if (this.isFeatured) {
            this.featuredPage = 1;
        }
        else {
            this.page = 1;
        }
        // this.isRevertCoords = true;
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
                    title: places['LOCATION_DENIED'],
                    message: places['YOU_HAVE_DENIED_ACCESS'],
                    buttons: [{
                        text: unit['OK'],
                        handler: () => {
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
                    title: content['LOCATION_NEEDED_PLACES'],
                    message: content['TURN_ON_LOCATION_PLACES'],
                    buttons: [
                        {
                            text: unit['CANCEL'],
                            handler: () => {
                                this.getLocation(true);
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

    ngOnDestroy() {
        if (this.platform.is('cordova')) {
            this.onResumeSubscription.unsubscribe();
        }
        if (this.onRefreshListSubscription) {
            this.onRefreshListSubscription.unsubscribe();
        }
        this.onRefreshTestimonials.unsubscribe();
        this.onRefreshUser.unsubscribe();
        this.onRefreshDefoultCoords.unsubscribe();
        this.onRefreshFeaturedOffers.unsubscribe();
    }

}
