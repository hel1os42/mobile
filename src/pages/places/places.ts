import { MockPlaceTypes } from '../../mocks/mockPlaceTypes';
import { Component } from '@angular/core';
import { LoadingController, NavController, PopoverController, Popover } from 'ionic-angular';
import { ChildCategory } from '../../models/childCategory';
import { Place } from '../../models/place';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { SelectedCategory } from '../../models/selectedCategory';
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { DistanceUtils } from '../../utils/distanse';
import { PlacePage } from '../place/place';
import { PlacesPopover } from './places.popover';
import { tileLayer, latLng, marker, popup, icon, LeafletEvent, Marker, LatLngBounds, LatLng, DomUtil } from 'leaflet';
import { RetailType } from '../../models/retailType';
import { Tag } from '../../models/tag';

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

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private offers: OfferService,
        private popoverCtrl: PopoverController,
        private loading: LoadingController) {

        this.offers.getCategories()
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    category.id = categories.data.find(p => p.name == category.name).id;//temporary - code
                })
                this.selectedCategory = this.categories[0];

                this.segment = "alloffers";
                let loadingLocation = this.loading.create({ content: 'Location detection', spinner: 'bubbles' });
                loadingLocation.present();
                this.location.get()
                    .then((resp) => {
                        this.coords = {
                            lat: resp.coords.latitude,
                            lng: resp.coords.longitude
                        };
                        loadingLocation.dismiss();
                        this.getCompaniesList();
                    })
                    .catch((error) => {
                        this.message = error.message;
                    });
                setTimeout(() => {
                    if (!this.coords) {
                        this.location.getByIp()
                            .subscribe(resp => {
                                this.coords = {
                                    lat: resp.latitude,
                                    lng: resp.longitude
                                };
                                loadingLocation.dismiss();
                                this.getCompaniesList();
                            })
                    }
                }, 10000);
            })
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
                iconSize: [25, 35],
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
                iconSize: [25, 35],
                iconAnchor: [13, 35],
                iconUrl: 'assets/img/places_pin.png',
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
            coords: this.coords
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
                    this.selectedTypes = resp.retail_types.map(p => {
                        let selectedSpecialities = p.specialities;
                        return {
                            id: p.id,
                            name: p.name,
                            parent_id: p.parent_id,
                            children_count: p.children_count,
                            specialities: selectedSpecialities
                                .map(i => {
                                    return {
                                        id: i.id,
                                        retail_type_id: i.retail_type_id,
                                        slug: i.slug,
                                        name: i.name,
                                        group: i.group,
                                        isSelected: false
                                    }
                                }),
                            isSelected: false
                        }
                    });
                    this.selectedTags = resp.tags.length > 0
                        ? resp.tags.map(t => {
                            return {
                                name: t.name,
                                slug: t.slug,
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
}
