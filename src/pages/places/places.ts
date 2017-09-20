import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { Coords } from '../../models/coords';
import { PlacePage } from '../place/place';
import { CompanyService } from '../../providers/company.service';
import { Company } from '../../models/company';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    isMapVisible: boolean = false;
    coords = new Coords;
    message;
    companies: Company[];

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private company: CompanyService) {
    }

    ionViewDidLoad() {
        this.companies = this.company.getCompanies();
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
        this.nav.push(PlacePage);
    }

}