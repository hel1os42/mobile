import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { SelectedTag } from '../../models/selectedTag';

@Component({
    selector: 'create-advUser-profile-popover-tags',
    templateUrl: 'create-advUser-profile.tags.popover.html'
})

// this component is not used

export class CreateAdvUserProfileTagsPopover {

    tags: SelectedTag[];
    categoryName: string;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.tags = this.navParams.get('tags');
        this.categoryName = this.navParams.get('categoryName');

    }

    save() {
        this.viewCtrl.dismiss(this.tags);
    }

    cancel() {
        this.viewCtrl.dismiss();
    }


}