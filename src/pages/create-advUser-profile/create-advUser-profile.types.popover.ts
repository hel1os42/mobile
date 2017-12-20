import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'create-advUser-profile-popover-types',
    templateUrl: 'create-advUser-profile.types.popover.html'
})

export class CreateAdvUserProfileTypesPopover {

    types;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams) {

        this.types = this.navParams.get('types');
    }

    save() {
        this.viewCtrl.dismiss(this.types);
    }

    cancel() {
        this.viewCtrl.dismiss();
    }


}
