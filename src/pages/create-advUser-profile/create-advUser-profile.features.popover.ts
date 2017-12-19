import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'create-advUser-profile-popover-features',
    templateUrl: 'create-advUser-profile.features.popover.html'
})

export class CreateAdvUserProfileFeaturesPopover {

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
