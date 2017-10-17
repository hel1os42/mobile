import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'places-popover-component',
    templateUrl: 'places.popover.html'
})

export class PlacesPopover {

    categories: SelectedCategory[];

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.categories = this.navParams.get('childCategories');
        }

    close() {
        this.viewCtrl.dismiss(this.categories);
    }

    clear() {
        for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].isSelected = false;
        }
    }
}