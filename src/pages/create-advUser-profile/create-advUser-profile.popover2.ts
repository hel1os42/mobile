import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SelectedCategory } from '../../models/selectedCategory';

@Component({
    selector: 'create-advUser-profile-popover-component2',
    templateUrl: 'create-advUser-profile.popover2.html'
})

export class CreateAdvUserProfilePopover2 {

    categories: SelectedCategory[];
    selectedCategory: any;

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams) {
    }
}