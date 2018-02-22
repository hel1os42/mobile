import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';
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

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.types = this.navParams.get('types');
        this.tags = this.navParams.get('tags') ? this.navParams.get('tags') : [];
        this.getSpecialities();
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
        this.viewCtrl.dismiss({ types: this.types, tags: this.tags, specialities: this.specialities.filter(spec => spec.isSelected) });
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

    cancel() {
        this.viewCtrl.dismiss();
    }
}