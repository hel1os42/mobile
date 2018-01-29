import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'places-popover-component',
    templateUrl: 'places.popover.html'
})

export class PlacesPopover {

    types;
    tags;
    isOpenTypesSelect = false;
    isOpenFeaturesSelect = false;
    isOpenCuisineSelect = true;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.types = this.navParams.get('types');
        this.tags = this.navParams.get('tags');
    }

    openTypesSelect() {
        this.isOpenTypesSelect = !this.isOpenTypesSelect;
        if (this.isOpenTypesSelect) {
            this.isOpenCuisineSelect = this.isOpenFeaturesSelect = !this.isOpenTypesSelect;
        }
    }

    openFeaturesSelect() {
        this.isOpenFeaturesSelect = !this.isOpenFeaturesSelect;
        if (this.isOpenFeaturesSelect) {
            this.isOpenCuisineSelect = this.isOpenTypesSelect = !this.isOpenFeaturesSelect;
        }
    }

    openCuisineSelect() {
        this.isOpenCuisineSelect = !this.isOpenCuisineSelect;
        if (this.isOpenCuisineSelect) {
            this.isOpenFeaturesSelect = this.isOpenTypesSelect = !this.isOpenCuisineSelect;
        }
    }

    close() {
        this.viewCtrl.dismiss({ types: this.types, tags: this.tags });
    }

    // clear(arr) {
    //     for (let i = 0; i < arr.length; i++) {
    //         arr[i].isSelected = false;
    //     }
    // }

    cancel() {
        this.viewCtrl.dismiss();
    }
}