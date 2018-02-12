import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { latLng, LeafletEvent, Map, tileLayer } from 'leaflet';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { OfferCategory } from '../../models/offerCategory';
import { Place } from '../../models/place';
import { RetailType } from '../../models/retailType';
import { SelectedCategory } from '../../models/selectedCategory';
import { SelectedTag } from '../../models/selectedTag';
import { Speciality } from '../../models/speciality';
import { Tag } from '../../models/tag';
import { ApiService } from '../../providers/api.service';
import { GeocodeService } from '../../providers/geocode.service';
import { OfferService } from '../../providers/offer.service';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { AboutUtils } from '../../utils/about.utils';
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
    company = new Place();
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
    lastOpened: string;
    aboutTitle: string;
    aboutDescription: string;

    constructor(
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
        private profile: ProfileService,
        private alert: AlertController,
        private translate: TranslateService) {

        this.offer.getCategories(true)
            .subscribe(categories => {
                this.categories.forEach((category) => {
                    let placeCategories = categories.data.find(p => p.name == category.name)
                    category.id = placeCategories.id;//temporary - code
                })
            });
        if (this.navParams.get('company')) {
            this.company = this.navParams.get('company');
            this.zoom = MapUtils.round(MapUtils.getZoom(this.company.latitude, this.company.radius, 95), 0.5);
            this.radius = this.company.radius;
            this.address = this.company.address;
            this.picture_url = this.company.picture_url;
            this.cover_url = this.company.cover_url;
            this.coords = {
                lat: this.company.latitude,
                lng: this.company.longitude
            };
            this.aboutTitle = AboutUtils.get(this.company.about).title;
            this.aboutDescription = AboutUtils.get(this.company.about).description;
            this.mapPresent();
            this.placeService.getWithCategory()
                .subscribe(company => {
                    this.offer.getTypes(company.category[0].id)//to do
                        .subscribe(resp => {
                            this.types = resp.retail_types;
                            this.tags = resp.tags ? resp.tags : undefined;
                            this.selectCategory(company.category[0]);
                            if ((company.tags && company.tags.length > 0) && (this.tags && this.tags.length > 0)) {
                                this.selectTags(company.tags);
                            }
                            if (company.retail_types && company.retail_types.length > 0) {
                                this.selectTypes(company.retail_types, company.specialities);
                            }
                        })
                });
        }
        else {
            this.coords.lat = this.navParams.get('latitude');
            this.coords.lng = this.navParams.get('longitude');
            if (this.coords.lat) {
                this.mapPresent(true);
            }
            else {
                this.profile.get(true)
                    .subscribe(user => {
                        this.coords = {
                            lat: user.latitude,
                            lng: user.longitude
                        };
                        this.mapPresent(true)
                    });
                // this.location.get()
                //     .then((resp) => {
                //         this.coords = {
                //             lat: resp.coords.latitude,
                //             lng: resp.coords.longitude
                //         };
                //         this.mapPresent(true)
                //     })
                //     .catch((error) => {
                //         this.message = error.message;
                //     });
                // setTimeout(() => {
                //     if (!this.coords.lat) {
                //         this.location.getByIp()
                //             .subscribe(resp => {
                //                 this.coords = {
                //                     lat: resp.latitude,
                //                     lng: resp.longitude
                //                 };
                //                 this.mapPresent(true);
                //             })
                //     }
                // }, 20000);
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

    selectCategory(category) {
        let rootCategories = this.categories.filter(p => p.id === category.id).map(item => {
            // let rootCategories = this.categories.filter(p => p.name === companyCategory.name).map(p => {// temporary
            return {
                ...item,
                image_url: item.imageAdvCreate_url,
                isSelected: item.id === category.id,
            }
        })
        this.selectedCategory = rootCategories[0];
    }

    selectTags(tags: Tag[]) {
        tags.forEach(k => {
            this.selectedTags = tags.map(tag => {
                return {
                    ...tag,
                    isSelected: true
                }
            });
        });
        this.tagsNames = this.selectedTags.map(t => ' ' + t.name);
    }

    selectTypes(types: RetailType[], specialities: Speciality[]) {
        this.selectedTypes = types.map(type => {
            let selectedSpecialities = specialities.filter(s => s.retail_type_id === type.id);
            return {
                ...type,
                specialities: this.types.filter(t => t.id === type.id)[0].specialities
                    .map(spec => {
                        return {
                            ...spec,
                            isSelected: selectedSpecialities.find(j => j.slug === spec.slug) ? true : false
                        }
                    }),
                isSelected: true
            }
        });
        this.typeNames = this.selectedTypes.map(p => ' ' + p.name);
        this.getFeaturesNames();
    }

    onMapReady(map: Map) {
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.coords = this._map.getCenter();
                if (this.coords.lng > 180 || this.coords.lng < -180) {
                    this.coords.lng = MapUtils.correctLng(this.coords.lng);
                    this._map.setView(this.coords, this._map.getZoom());
                }
                this.geocoder.getAddress(this.coords.lat, this.coords.lng)
                    .subscribe(resp => {
                        this.address = AddressUtils.get(resp);
                        this.changeDetectorRef.detectChanges();
                    });
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
            categories: this.categories.map(item => {
                return {
                    ...item,
                    image_url: item.imageAdvCreate_url,
                    isSelected: this.selectedCategory && item.id == this.selectedCategory.id,
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
                this.offer.getTypes(selectedCategories[0].id)//to do
                    .subscribe(resp => {
                        this.types = resp.retail_types;
                        this.tags = resp.tags;
                        this.getFeaturesNames();
                    })
            }
            if (selectedCategories && selectedCategories.length > 0) {
                this.selectedCategory = selectedCategories[0];

            }
        })
    }

    presentTagsPopover() {
        let popover = this.popoverCtrl.create(CreateAdvUserProfileTagsPopover, {
            categoryName: this.selectedCategory.name,
            tags: this.tags.map(tag => {
                return {
                    ...tag,
                    isSelected: this.selectedTags ? !!this.selectedTags.find(k => k.slug == tag.slug) : false
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
            types: this.types.map(type => {
                return {
                    ...type,
                    isSelected: this.selectedTypes ? this.selectedTypes.find(k => k.id == type.id) : false
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
                this.getFeaturesNames();
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
        this.selectedTypes.forEach(t => {
            t.specialities = _.reverse(_.values(_(t.specialities).groupBy(x => x.group).value()));
        });
        let popover = this.popoverCtrl.create(CreateAdvUserProfileFeaturesPopover, {
            types: this.selectedTypes,
            name: this.lastOpened
        });
        popover.present();
        popover.onDidDismiss(data => {
            if (!data) {
                return;
            }
            else {
                this.selectedTypes = data.types;
                this.lastOpened = data.name;
                this.selectedTypes.forEach(t => {
                    t.specialities = _.flatten(t.specialities);
                })
                this.lastOpened = data.name;
                this.getFeaturesNames();
            }
        });
    }

    getFeaturesNames() {
        if (this.selectedTypes) {
            let names = _.flatten(this.selectedTypes.map(t => t.specialities)).filter(p => p.isSelected);
            this.featuresNames = names.map(n => ' ' + n.name);
        }
        else {
            this.featuresNames = undefined;
        }
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
        if ((!this.selectedTags && this.tags && this.tags.length > 0) || !this.selectedCategory || !this.selectedTypes) {
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
            this.company.category = this.selectedCategory.id;// to do
            this.company.retail_types = this.selectedTypes.map(t => t.id);
            this.company.tags = this.selectedTags ? this.selectedTags.map(p => p.slug) : [];
            this.company.specialities = this.getFeatures(this.selectedTypes);
            this.company.radius = Math.round(this.radius);
            this.company.about = AboutUtils.set(this.aboutTitle, this.aboutDescription);

            let pictureUpload = (this.picture_url && this.isChangedLogo)
                ? this.api.uploadImage(this.picture_url, 'profile/place/picture', false)
                : Promise.resolve();
            let coverUpload = (this.cover_url && this.isChangedCover)
                ? this.api.uploadImage(this.cover_url, 'profile/place/cover', false)
                : Promise.resolve();
            if (!this.company.id) {
                this.placeService.set(this.company)
                    .subscribe(company => {
                        pictureUpload.then(() => {
                            coverUpload.then(() => this.nav.setRoot(AdvTabsPage, { company: company }));
                        });
                    })
            }
            else {
                // let different = DataUtils.difference(this.company, this.baseData);
                // let isEmpty = _.isEmpty(different);
                // if (!isEmpty || this.isChangedLogo || this.isChangedCover) {
                //     if (!isEmpty) {
                //         let keys = _.keys(different);
                //         for (let i = 0; i < keys.length; i++) {
                //             different[keys[i]] = this.company[keys[i]];
                //         }
                //     }
                this.presentConfirm(pictureUpload, coverUpload);
                // }
                // else {
                //     this.nav.pop();
                // }
            }
        }
    }

    presentConfirm(pictureUpload: Promise<any>, coverUpload: Promise<any>) {
        let adv = 'PAGE_CREATE-ADVUSER-PROFILE.';
        this.translate.get(
            ['PAGE_CREATE-ADVUSER-PROFILE', 'UNIT'])
            .subscribe(resp => {
                let adv = resp['PAGE_CREATE-ADVUSER-PROFILE'];
                let unit = resp['UNIT'];
                const alert = this.alert.create({
                    title: adv['WARNING'],
                    subTitle: adv['PROCEEDING_WILL_SWITCH'],
                    message: adv['ARE_YOU_SURE'],
                    buttons: [{
                        text: unit['CANCEL'],
                        role: unit['CANCEL'],
                        handler: () => {
                            return;
                        }
                    }, {
                        text: unit['OK'],
                        handler: () => {
                            this.placeService.putPlace(this.company)
                                .subscribe((company) => {
                                    pictureUpload.then(() => {
                                        coverUpload.then(() => {
                                            this.profile.refreshAccounts();
                                            this.placeService.refreshPlace();
                                            this.nav.pop()
                                        });
                                    });
                                })
                        }
                    }]
                });
                alert.present();
            })
    }
}

