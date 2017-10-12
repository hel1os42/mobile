import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import { OfferService } from '../../providers/offer.service';
import { ChildCategory } from '../../models/childCategory';

@Component({
    selector: 'places-alternative-popover-component',
    templateUrl: 'places.alternative.popover.html'
})

export class PlacesAlternativePopover {

    categories: ChildCategory[];
    selectCategories: any[];
    categoriesIds: string[];

    constructor(
        private viewCtrl: ViewController,
        private offer: OfferService,
        private navParams: NavParams) {

        this.categories = this.navParams.get('subCat');
        this.selectCategories = this.categories.map(p => p.id);

        for (let i = 0; i < this.selectCategories.length; i++) {
            this.selectCategories[i] = ({
                categoryId: this.categories[i].id,
                isSelected: false,
                name: this.categories[i].name
            });
        }

    }

    close() {
        let filtered = this.selectCategories.filter(p => p.isSelected);
        this.categoriesIds = filtered.map(p => p.categoryId);
        this.viewCtrl.dismiss(this.categoriesIds);
    }

    clear() {
        for (let i = 0; i < this.selectCategories.length; i++) {
            this.selectCategories[i].isSelected = false;
        }
    }
}
