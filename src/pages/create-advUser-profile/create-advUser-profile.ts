import { Component } from '@angular/core';
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { AdvUserProfilePage } from "../adv-user-profile/adv-user-profile";
import { NavController } from "ionic-angular";
import { OfferCategory } from '../../models/offerCategory';
import { ApiService } from '../../providers/api.service';
import * as _ from 'lodash';

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;
    selectedCategory: OfferCategory;
    categories: OfferCategory[];
    names: string[];

    constructor(
        private location: LocationService,
        private nav: NavController,
        private api: ApiService) {

    }

    ionViewDidLoad() {
        this.location.get()
            .then((resp) => {                
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                    };
                })
                .catch((error) => {
                    this.message = error.message;
                    console.log(this.message);
                });

        this.api.get('categories')
            .subscribe(resp => this.categories = resp.data);
    }

    openAdvUserProfile() {
        this.nav.push(AdvUserProfilePage);
    }
}