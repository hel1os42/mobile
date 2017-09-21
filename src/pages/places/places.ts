import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { AgmCoreModule, LatLngBounds, MapsAPILoader } from '@agm/core';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';
import { AppModeService } from '../../providers/appMode.service';
import { LocationService } from '../../providers/location.service';
import { Coords } from '../../models/coords';
import { PlacePage } from '../place/place';
import { Company } from '../../models/company';
import { OfferService } from '../../providers/offer.service';
import { PlacesPopover } from './places.popover';
import { google } from '@agm/core/services/google-maps-types';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})
export class PlacesPage {

    isMapVisible: boolean = false;
    coords = new Coords;
    mapBounds;
    mapCenter;
    message;
    companies: Company[];    

    constructor(
        private nav: NavController,
        private location: LocationService,
        private appMode: AppModeService,
        private offers: OfferService,
        private popoverCtrl: PopoverController,
        private mapsAPILoader: MapsAPILoader) {
                    
    }

    generateBounds(markers): any {
        if (markers && markers.length > 0) {
            let google = window['google'];
            
            let bounds = new google.maps.LatLngBounds();

            markers.forEach((marker: any) => {
                bounds.extend(new google.maps.LatLng({ lat: marker.latitude, lng: marker.longitude }));
            });

            //check if there is only one marker
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                return undefined;
            }

            return bounds;
        }
        
        return undefined;
    }

    ionViewDidLoad() {
        this.offers.getCompanies()
            .subscribe(companies => {
                this.companies = companies;
                this.mapsAPILoader.load()
                    .then(() => {
                        if (companies && companies.length == 1) {
                            this.mapCenter = {
                                lat: companies[0].latitude,
                                lng: companies[0].longitude,
                            };
                        }
                        this.mapBounds = this.generateBounds(companies);
                    })
            });

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
                this.mapCenter = {
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

    openPlace(id) {
        this.nav.push(PlacePage, { companyId: id });
    }

    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance(latitude: number, longitude: number) {
        return 200;
    }

    openPopover() {
        let popover = this.popoverCtrl.create(PlacesPopover);
        popover.present();
    }

}