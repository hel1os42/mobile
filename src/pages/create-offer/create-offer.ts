import { Component } from "@angular/core";
import { LocationService } from "../../providers/location.service";
import { AgmCoreModule } from '@agm/core';
import { Coords } from "../../models/coords";
import { NavController } from "ionic-angular";
import { MyOffersPage } from "../my-offers/my-offers";
import { Offer } from "../../models/offer";
import { OfferService } from "../../providers/offer.service";

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    radiuses = [50, 100, 150, 200, 250];
    radius: number = 200;
    message: string;
    coords: Coords = new Coords();
    dataOffer: Offer = new Offer;
    isSelectVisible: boolean = false;

    constructor(private location: LocationService,
        private nav: NavController,
        private offerService: OfferService) {
    }

    ionViewDidLoad() {
        this.offerService.getOffersData()
            .subscribe(resp => this.dataOffer = resp);
        
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

    createOffer() {
        this.nav.push(MyOffersPage);
    }

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }
}
