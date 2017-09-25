import { Component } from '@angular/core';
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

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    categories: OfferCategory[] = OfferCategory.StaticList;
    selectedCategory: OfferCategory;

    isMapVisible: boolean = false;
    coords = new Coords;
    mapBounds;
    mapCenter;
    message;
    companies: Company[];

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private offers: OfferService,
        private popoverCtrl: PopoverController,
        private mapsAPILoader: MapsAPILoader) {

        this.selectedCategory = this.categories[0];
    }

    ionSelected() {
        this.appMode.setHomeMode(false);
    }

    isSelectedCategory(category: OfferCategory) {
        return this.selectedCategory && this.selectedCategory.id == category.id;
    }

    selectCategory(category: OfferCategory) {
        this.selectedCategory = category;
        this.loadCompanies();
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

    filterCompaniesBySelectedCategory(companies: Company[]): Company[] {
        return companies.filter(p => {
            return p.categories.find(p => p.id == this.selectedCategory.id);
        })
    }

    loadCompanies() {
        this.offers.getCompanies(this.selectedCategory.id)
            .subscribe(companies => {
                this.companies = this.filterCompaniesBySelectedCategory(companies);

                this.mapsAPILoader.load()
                    .then(() => {
                        if (this.companies && this.companies.length == 1) {
                            this.mapCenter = {
                                lat: this.companies[0].latitude,
                                lng: this.companies[0].longitude,
                            };
                        }
                        this.mapBounds = this.generateBounds(this.companies);
                    })
            });
    }

    ionViewDidLoad() {
        this.loadCompanies();

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                this.mapCenter = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
            })
            .catch((error) => {
                this.message = error.message;
                console.log(this.message);
            });
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;
    }

    openPlace(id, categoryId) {
        this.nav.push(PlacePage, { companyId: id, categoryId: this.selectedCategory.id });
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {
        return 200;
    }

    openPopover() {
        let popover = this.popoverCtrl.create(PlacesPopover);
        popover.present();
    }

}
