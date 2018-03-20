import { Component, NgZone } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'places-popover-component',
    templateUrl: 'places.popover.html'
})

export class PlacesPopover {

    types = [];
    tags;
    specialities = [];
    isOpenTypesSelect = true;
    isOpenSpecialitiesSelect = false;
    isOpenCuisineSelect = false;
    STEPS = [0.2, 0.5, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 5000, 10000, 19849];
    radius: number;
    slider = 18;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private zone: NgZone) {

        this.types = this.navParams.get('types');
        this.tags = this.navParams.get('tags') ? this.navParams.get('tags') : [];
        this.radius = this.navParams.get('radius');
        for (let i = 0; i < this.STEPS.length; i++) {
            if (this.radius / 1000 == this.STEPS[i]) {
                this.slider = i;
            }
        }

        this.getSpecialities();
    }

    watchSlider() {
        this.zone.run(() => {
            this.radius = this.STEPS[this.slider] * 1000;
        })
    }

    openTypesSelect() {
        this.isOpenTypesSelect = !this.isOpenTypesSelect;
        if (this.isOpenTypesSelect) {
            this.isOpenCuisineSelect = this.isOpenSpecialitiesSelect = !this.isOpenTypesSelect;
        }
    }

    openSpecialitiesSelect() {
        this.isOpenSpecialitiesSelect = !this.isOpenSpecialitiesSelect;
        if (this.isOpenSpecialitiesSelect) {
            this.isOpenCuisineSelect = this.isOpenTypesSelect = !this.isOpenSpecialitiesSelect;
        }
    }

    openCuisineSelect() {
        this.isOpenCuisineSelect = !this.isOpenCuisineSelect;
        if (this.isOpenCuisineSelect) {
            this.isOpenSpecialitiesSelect = this.isOpenTypesSelect = !this.isOpenCuisineSelect;
        }
    }

    close() {
        this.viewCtrl.dismiss({
            types: this.types,
            tags: this.tags,
            specialities: this.specialities.filter(spec => spec.isSelected),
            radius: this.radius
        });
    }

    // clear(arr) {
    //     for (let i = 0; i < arr.length; i++) {
    //         arr[i].isSelected = false;
    //     }
    // }

    getSpecialities() {
        // this.specialities = [];
        let types = this.types.filter(type => type.isSelected);
        types.forEach(type => {
            type.specialities.forEach(spec => {
                this.specialities.forEach(item => {
                    if (spec.slug === item.slug) {
                        spec.isSelected = item.isSelected;
                    }
                })
            })
        });
        this.specialities = [];
        types.forEach(type => {
            this.specialities = [...this.specialities, ...type.specialities];
        });
        this.specialities = _.uniqBy(this.specialities, 'slug');

    }

    clear() {
        this.types = [];
        this.tags = [];
        this.specialities = [];
        this.viewCtrl.dismiss({
            types: this.types,
            tags: this.tags,
            specialities: this.specialities,
            radius: this.radius
        });
    }
}
