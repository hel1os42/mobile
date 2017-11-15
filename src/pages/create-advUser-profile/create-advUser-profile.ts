import { LatLngLiteral } from '@agm/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';
import { ChildCategory } from '../../models/childCategory';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { PlaceCreate } from '../../models/placeCreate';
import { SelectedCategory } from '../../models/selectedCategory';
import { ApiService } from '../../providers/api.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { PlaceService } from '../../providers/place.service';
import { ToastService } from '../../providers/toast.service';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { CreateAdvUserProfileCategoryPopover } from './create-advUser-profile.category.popover';
import { CreateAdvUserProfileChildCategoryPopover } from './create-advUser-profile.childCategory.popover';

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
    noChild: boolean;//temporary

    constructor(
        private location: LocationService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private offer: OfferService,
        private placeService: PlaceService,
        private changeDetectorRef: ChangeDetectorRef,
        private toast: ToastService,
        private imagePicker: ImagePicker,
        private api: ApiService,
        private navParams: NavParams) {

        this.coords.lat = this.navParams.get('latitude');
        this.coords.lng = this.navParams.get('longitude');

        if (!this.coords.lat || !this.coords.lng) {
            this.location.getByIp()
                .subscribe(resp => {
                    this.coords = {
                        lat: resp.latitude,
                        lng: resp.longitude
                    };
                })
        }

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
            if (this.selectedCategory && selectedCategories[0].id != this.selectedCategory.id) {
                this.selectedChildCategories = undefined;
            }
            if (selectedCategories.length > 0) {
                this.selectedCategory = selectedCategories[0];
            }
        })
        this.noChild = false;//temporary
    }

    showChildCategoriesPopover() {
        this.offer.getSubCategories(this.selectedCategory.id)
            .subscribe(resp => {
                this.childCategories = resp.children;

                this.noChild = resp.children.length == 0 ? true : false;//temporary

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
        let options = { maximumImagesCount: 1, width: 600, height: 600, quality: 75 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.picture_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    addCover() {
        let options = { maximumImagesCount: 1, width: 2560, height: 1440, quality: 75 };
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
        this.company.category_ids = this.selectedChildCategories ? this.selectedChildCategories.map(p => p.id) : [this.selectedCategory.id];

        this.company.radius = 30000;

        this.placeService.set(this.company)
            .subscribe(company => {
                let pictureUpload = this.picture_url
                    ? this.api.uploadImage(this.picture_url, 'profile/place/picture')
                    : Promise.resolve();

                pictureUpload.then(() => {
                    let coverUpload = this.cover_url
                        ? this.api.uploadImage(this.cover_url, 'profile/place/cover')
                        : Promise.resolve();

                    coverUpload.then(() => this.nav.setRoot(AdvTabsPage, { company: company }));
                });
            })

    }
}