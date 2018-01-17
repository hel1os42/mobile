import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { latLng, LeafletEvent, tileLayer } from 'leaflet';
import { Map } from 'leaflet';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { Place } from '../../models/place';
import { RetailType } from '../../models/retailType';
import { SelectedCategory } from '../../models/selectedCategory';
import { SelectedTag } from '../../models/selectedTag';
import { Tag } from '../../models/tag';
import { ApiService } from '../../providers/api.service';
import { GeocodeService } from '../../providers/geocode.service';
import { LocationService } from '../../providers/location.service';
import { OfferService } from '../../providers/offer.service';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { AddressUtils } from '../../utils/address.utils';
import { MapUtils } from '../../utils/map';
import { StringValidator } from '../../validators/string.validator';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { CreateAdvUserProfileCategoryPopover } from './create-advUser-profile.category.popover';
import { CreateAdvUserProfileFeaturesPopover } from './create-advUser-profile.features.popover';
import { CreateAdvUserProfileTagsPopover } from './create-advUser-profile.tags.popover';
import { CreateAdvUserProfileTypesPopover } from './create-advUser-profile.types.popover';

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;
    categories: OfferCategory[] = OfferCategory.StaticList;
    selectedCategory: SelectedCategory;
    tags: Tag[];
    selectedTags: SelectedTag[];
    tagsNames: string[];
    types: RetailType[];
    selectedTypes: RetailType[];
    typeNames: string[];
    featuresNames: string[];
    company: Place = new Place();
    address: string;
    picture_url: string;
    cover_url: string;
    formData: FormGroup;
    isChangedLogo = false;
    isChangedCover = false;
    tileLayer;
    _map: Map;
    options;
    // circle: CircleMarker;
    zoom = 16;
    radius: number;

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
        private navParams: NavParams,
        private builder: FormBuilder,
        private geocoder: GeocodeService,
        private profile: ProfileService) {

        this.offer.getCategories()
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    let placeCategories = categories.data.find(p => p.name == category.name)
                    category.id = placeCategories.id;//temporary - code
                    category.children_count = placeCategories.children_count;
                })
            });
        if (this.navParams.get('company')) {
            this.company = this.navParams.get('company');
            this.zoom = MapUtils.round(MapUtils.getZoom(this.company.latitude, this.company.radius, 95), 0.5);
            this.radius = this.company.radius;
            this.address = this.company.address;
            this.placeService.getWithCategory()
                .subscribe(company => {
                    this.company = company;
                    this.picture_url = this.company.picture_url;
                    this.cover_url = this.company.cover_url;
                    this.coords = {
                        lat: company.latitude,
                        lng: company.longitude
                    };
                    this.mapPresent();
                    this.selectCategory(company.categories);

                    if (company.retail_types && company.retail_types.length > 0) {//to do
                        this.selectTypes(company.retail_types);//to do
                    }
                })
        }
        else {
            this.coords.lat = this.navParams.get('latitude');
            this.coords.lng = this.navParams.get('longitude');
            this.mapPresent(true);

            if (!this.coords.lat) {
                this.location.get()
                    .then((resp) => {
                        this.coords = {
                            lat: resp.coords.latitude,
                            lng: resp.coords.longitude
                        };
                        this.mapPresent(true)
                    })
                    .catch((error) => {
                        this.message = error.message;
                    });
                setTimeout(() => {
                    if (!this.coords.lat) {
                        this.location.getByIp()
                            .subscribe(resp => {
                                this.coords = {
                                    lat: resp.latitude,
                                    lng: resp.longitude
                                };
                                this.mapPresent(true);
                            })
                    }
                }, 10000);
            }
        };

        this.formData = this.builder.group({
            companyName: new FormControl(this.company.name ? this.company.name : '', Validators.compose([
                StringValidator.validString,
                Validators.maxLength(30),
                //Validators.minLength(2),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
            companyDescription: new FormControl(this.company.description ? this.company.description : '', Validators.compose([
                StringValidator.validString,
                Validators.maxLength(250),
                //Validators.minLength(2),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
        });
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            maxNativeZoom: 18,
            minZoom: 1,
            attribution: '© OpenStreetMap',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
            tap: true
        });
        this.options = {
            layers: [this.tileLayer],
            zoom: this.zoom,
            center: latLng(this.coords),
            zoomSnap: 0.5,
            zoomDelta: 0.5
        };
        // this.circle = circleMarker(this.coords, { 
        //     radius: 75,
        //     color: '#ff8b10',
        //     opacity: 0.2,
        //     stroke: false
        // });
        // this.layers = [this.tileLayer, ...[this.circle]];
    }

    mapPresent(getRadius?) {
        this.addMap();
        this.geocoder.getAddress(this.coords.lat, this.coords.lng)
            .subscribe(resp => {
                this.address = AddressUtils.get(resp);
                if (getRadius) {
                    this.radius = MapUtils.getRadius(95, this._map);
                }
            })
    }

    selectCategory(categories) {
        let parentCategoryId = categories[0].parent_id === null ? categories[0].id : categories[0].parent_id;
        let rootCategories = this.categories.filter(p => p.id == parentCategoryId).map(p => {
            return {
                id: p.id,
                name: p.name,
                image_url: p.imageAdvCreate_url,
                isSelected: p.id == parentCategoryId,
                children_count: p.children_count,
            }
        })
        this.selectedCategory = rootCategories[0];
    }

    selectTypes(types) {
        // this.offer.getRetailTypes(this.selectedCategory.id)
        //     .subscribe(resp => {
        //         let typesSlugs = types.map(p => p.slug);
        //         let selectedTypes: any = _(resp.retail_types).keyBy('slug').at(typesSlugs).value();
        //         this.selectedTypes = selectedTypes.map(p => {
        //             return {
        //                 name: p.name,
        //                 slug: p.slug,
        //                 isSelected: true
        //             }
        //         })
        //         this.typeNames = this.selectedTypes.map(p => ' ' + p.name);
        //     })
    }

    onMapReady(map: Map) {
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.coords = this._map.getCenter();
                this.geocoder.getAddress(this.coords.lat, this.coords.lng)
                    .subscribe(resp => {
                        this.address = AddressUtils.get(resp);
                        this.changeDetectorRef.detectChanges();
                    })
                this.radius = MapUtils.getRadius(95, this._map);
                this.zoom = map.getZoom();
                // this.radius = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat / 180 * Math.PI)) / Math.pow(2, map.getZoom()+8) * 75;
                // this.circle.setLatLng(this.coords);
                // let zoom = Math.log2(40075016.686 * 75 * Math.abs(Math.cos(this.coords.lat / 180 * Math.PI)) / this.radius) - 8;
            }
        })
    }

    presentCategoriesPopover() {
        let popover = this.popoverCtrl.create(CreateAdvUserProfileCategoryPopover, {
            categories: this.categories.map(p => {
                return {
                    id: p.id,
                    name: p.name,
                    image_url: p.imageAdvCreate_url,
                    isSelected: this.selectedCategory && p.id == this.selectedCategory.id,
                    children_count: p.children_count
                }
            })
        });

        popover.present();
        popover.onDidDismiss(categories => {
            if (!categories)
                return;

            let selectedCategories: SelectedCategory[] = categories.filter(p => p.isSelected);
            if (this.selectedCategory && selectedCategories[0].id != this.selectedCategory.id) {
                this.selectedTags = undefined;
                this.selectedTypes = undefined;
            }
            if (selectedCategories.length > 0) {
                this.selectedCategory = selectedCategories[0];
                this.offer.getTypes(this.selectedCategory.id)//to do
                    .subscribe(resp => {
                        this.types = resp.retail_types;
                        this.tags = resp.tags;
                    })
            }
        })
    }

    presentTagsPopover() {
        let popover = this.popoverCtrl.create(CreateAdvUserProfileTagsPopover, {
            categoryName: this.selectedCategory.name,
            tags: this.tags.map(p => {
                return {
                    name: p.name,
                    slug: p.slug,
                    isSelected: this.selectedTags ? !!this.selectedTags.find(k => k.slug == p.slug) : false
                }
            })

        })
        popover.present();
        popover.onDidDismiss(tags => {
            if (!tags) {
                return;
            }

            let selectedTags: SelectedTag[] = tags.filter(p => p.isSelected);
            if (selectedTags.length > 0) {
                this.selectedTags = selectedTags;
                this.tagsNames = this.selectedTags.map(p => ' ' + p.name);
            }
            else {
                this.selectedTags = undefined;
            }
        })
    }

    presentTypesPopover() {
        if (this.selectedTypes && this.selectedTypes.length > 0) {
            this.types = _.uniqBy([...this.selectedTypes, ...this.types], 'id');
        }
        let popover = this.popoverCtrl.create(CreateAdvUserProfileTypesPopover, {
            types: this.types.map(t => {
                return {
                    id: t.id,
                    name: t.name,
                    parent_id: t.parent_id,
                    children_count: t.children_count,
                    specialities: t.specialities,
                    isSelected: this.selectedTypes ? this.selectedTypes.find(k => k.id == t.id) : false
                };
            })
        });
        popover.present();
        popover.onDidDismiss(types => {
            if (!types) {
                return;
            }
            let selectedTypes: RetailType[] = types.filter(t => t.isSelected);
            if (selectedTypes.length > 0) {
                this.selectedTypes = selectedTypes;
                this.typeNames = this.selectedTypes.map(p => ' ' + p.name);
            }
            else {
                this.selectedTypes = undefined;
            }
        });
    }

    presentFeaturesPopover() {
        this.selectedTypes.forEach(p => {
            p.specialities.forEach(s => {
                s.isSelected = s.isSelected ? s.isSelected : false
            })
        })
        let popover = this.popoverCtrl.create(CreateAdvUserProfileFeaturesPopover, {
            types: this.selectedTypes
        });
        popover.present();
        popover.onDidDismiss(types => {
            if (!types) {
                return;
            }
            else {
                this.selectedTypes = types;
                let names = _.flatten(this.selectedTypes.map(t => t.specialities)).filter(p => p.isSelected);
                this.featuresNames = names.map(n => n.name);
            }
        });
    }

    getFeatures(arr: RetailType[]) {
        let specsArr: any = _.flatten(arr.map(t => t.specialities)).filter(p => p.isSelected);
        specsArr = _.values(_(specsArr).groupBy(x => x.retail_type_id).value());
        let groupedSpecs = [];
        specsArr.forEach(s => {
            groupedSpecs.push({
                retail_type_id: s[0].retail_type_id,
                specs: s.map(k => k.slug)
            })
        })
        return groupedSpecs;
    }

    addLogo() {
        let options = { maximumImagesCount: 1, width: 600, height: 600, quality: 75 };
        this.imagePicker.getPictures(options)
            .then(results => {
                if (results[0] && results[0] !== 'O') {
                    this.picture_url = results[0];
                    this.isChangedLogo = true;
                }
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }

    addCover() {
        let options = { maximumImagesCount: 1, width: 2560, height: 1440, quality: 75 };
        this.imagePicker.getPictures(options)
            .then(results => {
                if (results[0] && results[0] != 'O') {
                    this.cover_url = results[0];
                    this.isChangedCover = true;
                }
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    };

    validate() {
        if ((!this.selectedTags && this.tags && this.tags.length > 0) || (!this.selectedCategory) || (!this.selectedTypes)) {
            this.toast.show('Please select category, type and features');
            return false;
        }
        else return true;
    }

    createAccount() {
        if (this.validate()) {
            this.company.name = this.formData.value.companyName;
            this.company.description = this.formData.value.companyDescription;
            this.company.latitude = this.coords.lat;
            this.company.longitude = this.coords.lng;
            this.company.address = this.address;
            this.company.category = this.selectedCategory.id;
            this.company.retail_types = this.selectedTypes.map(p => p.id);
            this.company.radius = Math.round(this.radius);
            this.company.tags = this.selectedTags ? this.selectedTags.map(p => p.slug) : undefined;
            this.company.specialities = this.getFeatures(this.selectedTypes);

            if (!this.company.id) {
                this.placeService.set(this.company)
                    .subscribe(company => {
                        let pictureUpload = this.picture_url
                            ? this.api.uploadImage(this.picture_url, 'profile/place/picture', false)
                            : Promise.resolve();
                        pictureUpload.then(() => {
                            let coverUpload = this.cover_url
                                ? this.api.uploadImage(this.cover_url, 'profile/place/cover', false)
                                : Promise.resolve();

                            coverUpload.then(() => this.nav.setRoot(AdvTabsPage, { company: company }));
                        });
                    })
            }
            else {
                if (this.company.id) {
                    if (!this.company.about) {
                        this.company.about = undefined;
                    }
                    this.placeService.putPlace(this.company)
                        .subscribe((company) => {
                            let pictureUpload = (this.picture_url && this.isChangedLogo)
                                ? this.api.uploadImage(this.picture_url, 'profile/place/picture', false)
                                : Promise.resolve();

                            pictureUpload.then(() => {
                                let coverUpload = (this.cover_url && this.isChangedCover)
                                    ? this.api.uploadImage(this.cover_url, 'profile/place/cover', false)
                                    : Promise.resolve();

                                coverUpload.then(() => {
                                    this.profile.refreshAccounts();
                                    this.placeService.refreshPlace();
                                    this.nav.pop()
                                });
                            });
                        })
                }
            }

        }
    }
}
