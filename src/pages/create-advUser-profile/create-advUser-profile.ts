import { Component, ChangeDetectorRef } from '@angular/core';
import { LocationService } from '../../providers/location.service';
import { Coords } from '../../models/coords';
import { NavController, PopoverController } from 'ionic-angular';
import { OfferCategory } from '../../models/offerCategory';
import { CreateAdvUserProfileCategoryPopover } from './create-advUser-profile.category.popover';
import * as _ from 'lodash';
import { OfferService } from '../../providers/offer.service';
import { SelectedCategory } from '../../models/selectedCategory';
import { LatLngLiteral } from '@agm/core';
import { AgmCoreModule } from '@agm/core';
import { ChildCategory } from '../../models/childCategory';
import {CreateAdvUserProfileChildCategoryPopover } from './create-advUser-profile.childCategory.popover';
import { PlaceCreate } from '../../models/placeCreate';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { PlaceService } from '../../providers/place.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { ToastService } from '../../providers/toast.service';
import { ApiService } from '../../providers/api.service';

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
    childCategoriesNames: string[];
    company = new PlaceCreate();
    address: string;
    picture_url: string;
    cover_url: string;

    constructor(
        private location: LocationService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private offer: OfferService,
        private placeService: PlaceService,
        private changeDetectorRef: ChangeDetectorRef,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService) {

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
        let popover = this.popoverCtrl.create(CreateAdvUserProfileCategoryPopover, {
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

    showChildCategoriesPopover() {
        this.offer.getSubCategories(this.selectedCategory.id)
            .subscribe(resp => {
                this.childCategories = resp.children;
                let popover = this.popoverCtrl.create(CreateAdvUserProfileChildCategoryPopover, {
                    categoryName: this.selectedCategory.name,
                    categories: this.childCategories.map(p => {
                        return {
                            id: p.id,
                            name: p.name,
                            image_url: '',
                            isSelected: this.selectedChildCategories ? !!this.selectedChildCategories.find(k => k.id == p.id) : false
                        }
                    })

                })
                popover.present();
                popover.onDidDismiss(categories => {
                    if (!categories) {
                        return;
                    }

                    let selectedCategories: SelectedCategory[] = categories.filter(p => p.isSelected);
                    if (selectedCategories.length > 0) {
                        this.selectedChildCategories = selectedCategories;
                        this.childCategoriesNames = this.selectedChildCategories.map(p => ' ' + p.name);
                    }
                    else {
                        this.selectedChildCategories = undefined;
                    }
                })
            })

    }

    addLogo() {
        let options = { maximumImagesCount: 1 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.picture_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    addCover() {
        let options = { maximumImagesCount: 1 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.cover_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    createAccount() {
        this.company.latitude = this.coords.lat;
        this.company.longitude = this.coords.lng;
        this.company.address = this.address;
        this.company.category_ids = this.selectedChildCategories ? this.selectedChildCategories.map(p => p.id) : [];
      
        this.company.radius = 30000;

        this.placeService.set(this.company)
            .subscribe(resp => {
                this.api.uploadImage(this.picture_url, 'profile/place/picture');
                this.api.uploadImage(this.cover_url, 'profile/place/cover');
                this.nav.push(AdvTabsPage, {company: resp});
            })
    }
}