import { Component, ChangeDetectorRef } from '@angular/core';
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { AdvUserProfilePage } from "../adv-user-profile/adv-user-profile";
import { NavController, PopoverController } from "ionic-angular";
import { OfferCategory } from '../../models/offerCategory';
import { ApiService } from '../../providers/api.service';
import { CreateAdvUserProfilePopover1 } from './create-advUser-profile.popover1';
import * as _ from 'lodash';
import { OfferService } from '../../providers/offer.service';
import { SelectedCategory } from '../../models/selectedCategory';
import { LatLngLiteral } from '@agm/core';
import { AgmCoreModule } from '@agm/core';
import { ChildCategory } from '../../models/childCategory';

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;
    categories: OfferCategory[] = OfferCategory.StaticList;
    childCategories: ChildCategory[];
    selectedCategory: SelectedCategory;
    selectedChildCategories: SelectedCategory[];

    address: string;

    constructor(
        private location: LocationService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private api: ApiService,
        private offer: OfferService,
        private changeDetectorRef: ChangeDetectorRef) {

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
                this.address = results[0].formatted_address;
                // this.city = this.findResult(results, "locality");
                // this.country = this.findResult(results, "country");
                this.changeDetectorRef.detectChanges();
                console.log(results);
            }
        });
    }

    showCategoriesPopover() {
        let popover = this.popoverCtrl.create(CreateAdvUserProfilePopover1, {
            categories: this.categories.map(p => {
                return {
                    id: p.id,
                    name: p.name,
                    image_url: p.imageAdvCreate_url,
                    isSelected: this.selectedCategory && p.id == this.selectedCategory.id
                }
            })
        });

        popover.present();
        popover.onDidDismiss(categories => {
            if (!categories)
                return;

            let selectedCategories: SelectedCategory[] = categories.filter(p => p.isSelected);
            if (selectedCategories.length > 0) {
                this.selectedCategory = selectedCategories[0];
            }
        })
    }

    createAccount() {
        this.nav.push(AdvUserProfilePage);
    }
}