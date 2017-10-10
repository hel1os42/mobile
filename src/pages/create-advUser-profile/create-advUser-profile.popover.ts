import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'create-advUser-profile-popover-component',
    templateUrl: 'create-advUser-profile.popover.html'
})

export class CreateAdvUserProfilePopover {

    categories: any[];

    constructor(private viewCtrl: ViewController,
        private app: App,
        private navParams: NavParams) {

        this.categories = this.navParams.get('categories');
    }

    done() {
        this.viewCtrl.dismiss(this.categories);
    }

    selectCategory(category) {
        for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].isSelected = category.id == this.categories[i].id;
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }
}