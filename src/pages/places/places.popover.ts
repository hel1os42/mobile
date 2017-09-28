import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import { SubCategory } from '../../models/offerSubCategory';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'places-popover-component',
    templateUrl: 'places.popover.html'
})

export class PlacesPopover {

    categories: SubCategory[];
    categoryId: string;
    selectedCategories: string[] = [];
    selected: boolean;

    constructor(
        private viewCtrl: ViewController,
        private app: App,
        private offer: OfferService,
        private navParams: NavParams) { 
        
       this.categories = this.navParams.get('subCat');
        }

    selectCategory(name) {
      
        this.selectedCategories = this.selectedCategories + name;
   
    }

    close() {
        this.selectedCategories;
        this.viewCtrl.dismiss();        
    }

    back() {
        this.viewCtrl.dismiss(); 
    }
}