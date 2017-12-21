import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'create-advUser-profile-popover-features',
    templateUrl: 'create-advUser-profile.features.popover.html'
})

export class CreateAdvUserProfileFeaturesPopover {

    features;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams) {

        this.features = this.navParams.get('features');
    }

    save() {
        this.viewCtrl.dismiss(this.features);
    }

    cancel() {
        this.viewCtrl.dismiss();
    }


}
