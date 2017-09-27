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

    constructor(
        private viewCtrl: ViewController,
        private app: App,
        private offer: OfferService,
        private navParams: NavParams) { 
        
        this.categoryId = this.navParams.get('categoryId');
        this.offer.getSubCategories(this.categoryId)
            .subscribe(categories => this.categories = categories.children);
        }

    close() {
        this.viewCtrl.dismiss();        
    }
}