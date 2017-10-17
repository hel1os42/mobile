import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'create-advUser-profile-category-popover',
    templateUrl: 'create-advUser-profile.category.popover.html'
})

export class CreateAdvUserProfileCategoryPopover {

    categories: SelectedCategory[];
    selectedCategory: any;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams) {

        this.categories = this.navParams.get('categories');
        this.selectedCategory = this.categories.find(p => p.isSelected);
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