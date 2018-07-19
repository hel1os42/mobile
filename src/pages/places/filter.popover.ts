import { Component, NgZone } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'filter-popover-component',
    templateUrl: 'filter.popover.html'
})

export class FilterPopover {

    types = [];
    tags;
    specialities = [];
    isOpenTypesSelect = true;
    isOpenSpecialitiesSelect = false;
    isOpenCuisineSelect = false;
    STEPS = [0.2, 0.5, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 5000, 10000, 19849];
    radius: number;
    slider = 18;
    lengthSteps: number;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private zone: NgZone) {

        this.types = this.navParams.get('types');
        this.tags = this.navParams.get('tags') ? this.navParams.get('tags') : [];
        let radius = this.navParams.get('radius');
        this.radius = radius > 1 ? Math.round(radius) : radius;
        let step = this.radius / 1000 > 1
            ? Math.round(this.radius / 1000)
            : Math.round(this.radius / 1000 * 100) / 100;
        if (!this.STEPS.find(item => item == step)) {
            this.STEPS.push(step);
            this.STEPS = _.sortBy(this.STEPS);
        }
        this.lengthSteps = this.STEPS.length - 1;
        for (let i = 0; i < this.STEPS.length; i++) {
            if (Math.round(radius / 1000) == this.STEPS[i] || Math.round(this.radius / 1000 * 100) / 100 == this.STEPS[i]) {
                this.slider = i;
            }
        }
            this.getSpecialities();
    }

    getRadius() {
        let radius = this.radius / 1000 > 1
            ? Math.round(this.radius / 1000)
            : Math.round(this.radius / 1000 * 100) / 100;
        return radius;
    }

    watchSlider() {
        this.zone.run(() => {
            this.radius = this.STEPS[this.slider] * 1000;
            this.STEPS;
        })
    }

    getLength() {
        return this.STEPS.length - 1;
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

    getSpecialities(type?) {
        this.specialities;
        if (type && !type.isSelected) {
            type.specialities.forEach(item => {
                item.isSelected = false;
            });
            this.types;
            this.specialities;
        }
        else if (type && type.isSelected && this.specialities.length > 0) {
            type.specialities.forEach(item => {
                this.specialities.forEach(spec => {
                    if (item.slug === spec.slug) {
                        item.isSelected = spec.isSelected;
                    }
                });
            });
        }
        // this.specialities = [];
        let types = this.types.filter(type => type.isSelected);
        types.forEach(item => {
            item.specialities.forEach(spec => {
                this.specialities.forEach(item => {
                    if (spec.slug === item.slug) {
                        spec.isSelected = item.isSelected;
                    }
                })
            })
        });
        this.specialities = [];
        types.forEach(type => {
            this.specialities = [...this.specialities, ..._.cloneDeep(type.specialities)];
        });
        this.specialities = _.uniqBy(this.specialities, 'slug');
    }

    checkSpeciality(speciality) {
        this.types.forEach(type => {
            if (type.isSelected) {
                type.specialities.forEach(spec => {
                    if (spec.slug === speciality.slug) {
                        spec.isSelected = speciality.isSelected;
                    }
                })
            }
        })
    }

    close() {
        this.viewCtrl.dismiss({
            types: this.types,
            tags: this.tags,
            specialities: this.specialities.filter(spec => spec.isSelected),
            radius: this.radius
        });
    }

    clear() {
        this.viewCtrl.dismiss({
            types: this.types = [],
            tags: this.tags = [],
            specialities: this.specialities = [],
            radius: this.radius
        });
    }
}
