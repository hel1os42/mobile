import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';

@Component({
    selector: 'create-advUser-profile-popover-component',
    templateUrl: 'create-advUser-profile.popover.html'
})

export class CreateAdvUserProfilePopover {

    page: any;

    constructor(private viewCtrl: ViewController,
                private app: App,
                private navParams: NavParams) { 
      
    }
}