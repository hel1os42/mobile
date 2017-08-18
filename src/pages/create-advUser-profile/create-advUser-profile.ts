import { Component } from '@angular/core';
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;

    constructor(private location: LocationService) {

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
}