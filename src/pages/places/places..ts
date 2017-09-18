import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    constructor(
        private nav: NavController) {
    }

   
   
}