import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { Coords } from '../../models/coords';
import { PlacePage } from '../place/place';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    isMapVisible: boolean = false;
    coords = new Coords;
    message;
    tempCoords: Coords[] = [
        {
            lat: 49.3,
            lng: 28.4999998
        },
        {
            lat: 49.1442104,
            lng: 28.4459988
        },
        {
            lat: 49.4442110,
            lng: 28.445870499999955
        },
        {
            lat: 49.2643,
            lng: 28.44589922
        },
        {
            lat: 49.284215,
            lng: 28.7458
        },
        {
            lat: 49.284415,
            lng: 28.4658
        },
        {
            lat: 49.294215,
            lng: 28.4458
        },
    ];

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService) {
    }

    ionViewDidEnter() {
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
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;
    }

    openPlace() {
        this.nav.setRoot(PlacePage);
    }

}