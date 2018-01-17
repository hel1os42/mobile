import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'create-advUser-profile-popover-features',
    templateUrl: 'create-advUser-profile.features.popover.html'
})

export class CreateAdvUserProfileFeaturesPopover {

    types;
    isOpenSelect: string;

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.types = this.navParams.get('types');
        this.types.forEach(t => {
            t.specialities = _.reverse(_.values(_(t.specialities).groupBy(x => x.group).value()));
        }); 
    }

    openSelect(name) {
        this.isOpenSelect = this.isOpenSelect == name ? undefined : name;
    }

    checkGroup(arr, speciality) {
        if (speciality.group !== null) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].slug !== speciality.slug) {
                    arr[i].isSelected = false;
                }
            }
        }
    }

    save() {
        this.types.forEach(t => {
            t.specialities = _.flatten(t.specialities);
        })
        this.viewCtrl.dismiss(this.types);
    }

    cancel() {
        this.viewCtrl.dismiss();
    }


}
