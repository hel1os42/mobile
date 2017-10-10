import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'create-advUser-profile-popover-component',
    templateUrl: 'create-advUser-profile.popover.html'
})

export class CreateAdvUserProfilePopover {

    categories: any[];
    selectedCategory: any;

    constructor(private viewCtrl: ViewController,
        private app: App,
        private navParams: NavParams) {

        this.categories = this.navParams.get('categories');
    }

    selectCategory(category) {
        this.selectedCategory = category.isSelected ? category : undefined;
        for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].isSelected = category.id == this.categories[i].id;
        }
    }

    canSave() {
        return this.selectedCategory;        
    }

    save() {
        this.viewCtrl.dismiss(this.categories);
    }    

    cancel() {
        this.viewCtrl.dismiss();
    }
}