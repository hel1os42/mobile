import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { AgmCoreModule, LatLngBounds, MapsAPILoader } from '@agm/core';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { Coords } from '../../models/coords';
import { PlacePage } from '../place/place';
import { Company } from '../../models/company';
import { OfferService } from '../../providers/offer.service';
import { PlacesPopover } from './places.popover';
import { google } from '@agm/core/services/google-maps-types';
import { OfferCategory } from '../../models/offerCategory';
import { DistanceUtils } from '../../utils/distanse';
import { ChildCategory } from '../../models/childCategory';
import { SelectedCategory } from '../../models/selectedCategory';


@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    companies: Company[];
    categories: OfferCategory[] = OfferCategory.StaticList;
    childCategories: ChildCategory[];
    selectedChildCategories: SelectedCategory[];
    selectedCategory = new OfferCategory;
    isMapVisible: boolean = false;
    coords: Coords = {
        lat: 50,
        lng: 30
    };
    mapBounds;
    mapCenter: Coords;
    message: string;
    radius = 50000000;
    segment: string;
    distanceString: string;
    search: string;
    categoryFilter: string[];

    // @ViewChild(Content)
    // content: Content;

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private offers: OfferService,
        private popoverCtrl: PopoverController,
        private mapsAPILoader: MapsAPILoader) {

        this.selectedCategory = this.categories[0];
        this.segment = "alloffers";

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                if (!this.mapCenter) {
                    this.mapCenter = {
                        lat: resp.coords.latitude,
                        lng: resp.coords.longitude
                    };
                }
            })
            .catch((error) => {
                this.message = error.message;
            });

        this.loadCompanies([this.selectedCategory.id], this.search);
        this.categoryFilter = [this.selectedCategory.id];
    }

    // ngAfterViewInit() {
    //     this.content.ionScroll.subscribe(event => {
    //         console.log('scrolling', event);
    //     });
    // }

    ionSelected() {
        this.appMode.setHomeMode(false);
    }

    isSelectedCategory(category: OfferCategory) {
        return this.selectedCategory && this.selectedCategory.id == category.id;
    }

    selectCategory(category: OfferCategory) {
        this.search = ""
        this.selectedCategory = category;
        this.loadCompanies([this.selectedCategory.id], this.search);
        this.categoryFilter = [this.selectedCategory.id];
    }

    generateBounds(markers): any {
        if (markers && markers.length > 0) {
            let google = window['google'];

            let bounds = new google.maps.LatLngBounds();

            markers.forEach((marker: any) => {
                bounds.extend(new google.maps.LatLng({ lat: marker.latitude, lng: marker.longitude }));
            });

            //check if there is only one marker
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                return undefined;
            }
            return bounds;
        }
        return undefined;
    }

    loadCompanies(categoryId, search) {
        this.offers.getPlaces(categoryId, this.coords.lat, this.coords.lng, this.radius, search)
            .subscribe(companies => {
                this.companies = companies.data.filter(p => p.offers_count > 0);
                // this.companies = companies.data;
                this.mapsAPILoader.load()
                    .then(() => {
                        if (this.companies.length == 0 && this.coords) {
                            this.mapCenter = this.coords;
                        }
                        else if (this.companies.length == 1) {
                            this.mapCenter = {
                                lat: this.companies[0].latitude,
                                lng: this.companies[0].longitude,
                            };
                        };
                        this.mapBounds = this.generateBounds(this.companies);
                    })
            });
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;
    }

    openPlace(company, distance) {
        this.nav.push(PlacePage, { company: company, distance: this.getDistance(company.latitude, company.longitude) });
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

    openPopover() {
        this.offers.getSubCategories(this.selectedCategory.id)
            .subscribe(category => {
                this.search = "";
                this.childCategories = category.children;
                let popover = this.popoverCtrl.create(PlacesPopover, {
                    childCategories: this.childCategories.map(p => {
                        return {
                            id: p.id,
                            name: p.name,
                            isSelected: this.selectedChildCategories ? !!this.selectedChildCategories.find(k => k.id == p.id) : false
                        }
                    })
                });
                popover.present();
                popover.onDidDismiss((categories) => {
                    if (!categories) {
                        return;
                    }

                    let selectedCategories: SelectedCategory[] = categories.filter(p => p.isSelected);
                    if (selectedCategories.length > 0) {
                        this.selectedChildCategories = selectedCategories;
                        this.categoryFilter = this.selectedChildCategories.map(p => p.id);
                    }
                    else {
                        this.selectedChildCategories = undefined;
                        // this.categoryFilter = this.childCategories.map(p => p.id);to do
                        this.categoryFilter = [this.selectedCategory.id];
                    }
                    this.loadCompanies(this.categoryFilter, this.search);
                })
            });
    }

    searchCompanies($event) {
        this.loadCompanies(this.categoryFilter, this.search);
    }

}
