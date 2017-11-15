import { LatLngLiteral } from '@agm/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer4Page } from '../create-offer-4/create-offer-4';

@Component({
    selector: 'page-create-offer-3',
    templateUrl: 'create-offer-3.html'
})
export class CreateOffer3Page {

    offer: OfferCreate;
    coords: Coords = new Coords();
    message: string;
    bounds;
    city: string;
    picture_url: string;
    // cities: string[] = ['Moscow', 'Berlin', 'Manila', 'Bogotá', 'Kyiv'];
    // country: string;
    // address: string;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private changeDetectorRef: ChangeDetectorRef) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        this.coords.lat = this.offer.latitude;
        this.coords.lng = this.offer.longitude;

        this.geocodeDebounced();

    }

    onMapCenterChange(center: LatLngLiteral) {
        this.coords.lat = center.lat;
        this.coords.lng = center.lng;
        this.geocodeDebounced();
    }

    geocodeDebounced = _.debounce(this.geocode, 1000);

    geocode() {
        let google = window['google'];
        let geocoder = new google.maps.Geocoder();
        let latlng = { lat: this.coords.lat, lng: this.coords.lng };
        geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (status === 'OK') {
                // let timezone = results.timeZoneId;
                results = results[0].address_components;
                this.city = this.findResult(results, "locality");
                this.offer.country = this.findResult(results, "country");
                this.changeDetectorRef.detectChanges();
                console.log(results);
            }
        });
    }

    findResult(results, name) {
        let result = _.find(results, function (obj: any) {
            return obj.types[0] == name && obj.types[1] == "political";
        });
        return result ? result.long_name : null;
    };

    // toCity($event) {
    //     let google = window['google'];
    //     let geocoder = new google.maps.Geocoder();
    //     geocoder.geocode({ 'address': this.city }, (results, status) => {
    //         if (status === 'OK') {
    //             let result = results[0].geometry.bounds;
    //             let bounds = new google.maps.LatLngBounds();
    //             bounds.extend(new google.maps.LatLng(result.f.b, result.b.b));
    //             bounds.extend(new google.maps.LatLng(result.f.f, result.b.f));
    //             this.bounds = bounds;
    //         }
    //     });

    // }

    openCreateOffer4Page() {
        this.offer.radius = 30000;//todo
        this.offer.city = this.city;
        
        this.nav.push(CreateOffer4Page, { offer: this.offer, picture: this.picture_url });
    }

}
