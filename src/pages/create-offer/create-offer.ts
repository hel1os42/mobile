import { Component } from "@angular/core";
import { LocationService } from "../../providers/location.service";
import { AgmCoreModule } from '@agm/core';
import { Coords } from "../../models/coords";
import { NavController } from "ionic-angular";
import { UserOffersPage } from "../user-offers/user-offers";
import { Offer } from "../../models/offer";
import { OfferService } from "../../providers/offer.service";
import { ProfileService } from "../../providers/profile.service";
import { AdvUserOffersPage } from "../adv-user-offers/adv-user-offers";
import { OfferCategory } from "../../models/offerCategory";

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    radiuses = [50, 100, 150, 200, 250];
    message: string;
    coords = new Coords();
    offer = new Offer();
    isSelectVisible = false;
    offerCategory = new OfferCategory();
    offerCategories = Array(this.offerCategory);
   
    constructor(private location: LocationService,
                private nav: NavController,
                private offerService: OfferService,
                private profileService: ProfileService) {
    }

    ionViewDidLoad() {
        this.offerService.getOfferData()
            .subscribe(resp => this.offer = resp);
        
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

       
        this.offerService.getCategories()
            .subscribe(resp => this.offerCategories = resp.data);
    }

    createOffer() {

        this.offer.label = "name";
        this.offer.reward = 1;
        this.offer.country = "country";
        this.offer.city = "city";
        this.offer.max_count = 1;
        this.offer.max_for_user = 1;
        this.offer.max_per_day = 1;
        this.offer.max_for_user_per_day = 1;
        this.offer.radius = 1;
        this.offer.description = "description";
        this.offer.start_date = "2017-09-01T10:00:00+0000";
        this.offer.finish_date = "2017-09-01T11:00:00+0000";
        this.offer.start_time = "10:00:00+0000";
        this.offer.finish_time = "11:00:00+0000";
        this.offer.user_level_min = 1;
        this.offer.latitude = this.coords.lat;
        this.offer.longitude = this.coords.lng;
        this.offer.category_id = "this.offerCategories[1].id";
  
        this.offerService.setOffer(this.offer);

        this.nav.push(AdvUserOffersPage);
    }

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }
}
