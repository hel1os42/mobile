import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'create-advUser-profile-popover-features',
    templateUrl: 'create-advUser-profile.features.popover.html'
})

// this component is not used

export class CreateAdvUserProfileFeaturesPopover {

    types;
    openedSelect: string;
    lastOpened: string;
    isConverted: boolean;

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.types = this.navParams.get('types');
        this.lastOpened = this.navParams.get('name');
        let name = this.lastOpened ? this.lastOpened : this.types[this.types.length - 1].name;
        this.openSelect(name);
    }

    openSelect(name) {
        this.openedSelect = this.openedSelect == name ? undefined : name;
        this.lastOpened = name;
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
        this.isConverted = true;
        this.viewCtrl.dismiss({ types: this.types, name: this.lastOpened });
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    ngOnDestroy() {
        if (!this.isConverted) {
            this.types.forEach(t => {
                t.specialities = _.flatten(t.specialities);
            })
        }
    }
}
