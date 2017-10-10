import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';

@Component({
    selector: 'create-advUser-profile-popover-component',
    templateUrl: 'create-advUser-profile.popover.html'
})

export class CreateAdvUserProfilePopover {

    rootCategories: any[];

    constructor(private viewCtrl: ViewController,
                private app: App,
                private navParams: NavParams) { 
      
    // this.rootCategories = this.navParams.get('root.Categories');
            this.rootCategories = this.navParams.get('rootCategories');
    }

    close() {
        this.viewCtrl.dismiss(this.rootCategories);
    }
    
    clear() {
        for (let i = 0; i < this.rootCategories.length; i++) {
            this.rootCategories[i].isSelected = false;
        }
    }
}