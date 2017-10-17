import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'create-advUser-profile-popover-childCategory',
    templateUrl: 'create-advUser-profile.childCategory.popover.html'
})

export class CreateAdvUserProfileChildCategoryPopover {

    categories: SelectedCategory[];
    categoryName: string;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams) {

        this.categories = this.navParams.get('categories');
        this.categoryName = this.navParams.get('categoryName');
       
    }

    save() {
        this.viewCtrl.dismiss(this.categories);
    } 
    
    cancel() {
        this.viewCtrl.dismiss();
    }


}