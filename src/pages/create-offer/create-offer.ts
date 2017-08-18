import { Component } from "@angular/core";
import { LocationService } from "../../providers/location.service";
import { AgmCoreModule} from '@agm/core';
import { Coords } from "../../models/coords";

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    radiuses = [50, 100, 150, 200, 250];
    radius: number = 200;
    message: string;
    coords: Coords = new Coords();

    constructor(private location: LocationService) {
        
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
    }
}
