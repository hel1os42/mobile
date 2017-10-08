import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOffer4Page } from '../create-offer-4/create-offer-4';
import { Coords } from '../../models/coords';
import { LocationService } from '../../providers/location.service';
import { LatLngLiteral } from '@agm/core';
import { AgmCoreModule } from '@agm/core';
import * as _ from 'lodash';

@Component({
    selector: 'page-create-offer-3',
    templateUrl: 'create-offer-3.html'
})
export class CreateOffer3Page {

    offer: OfferCreate;
    coords: Coords = new Coords();
    message: string;
    cities: string[] = ['Moscow', 'Berlin', 'Manila', 'Bogotá', 'Kyiv'];
    city: string;
    country: string
    bounds;
    // country: string;
    // address: string;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private location: LocationService,
        private changeDetectorRef: ChangeDetectorRef) {

        this.offer = this.navParams.get('offer');
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
                let timezone = results.timeZoneId;
                results = results[0].address_components;
                debugger
                this.city = this.findResult(results, "locality");
                this.country = this.findResult(results, "country");
                this.changeDetectorRef.detectChanges();
                console.log(results);
                debugger
            }
        });
    }

    findResult(results, name) {
        let result = _.find(results, function (obj: any) {
            return obj.types[0] == name && obj.types[1] == "political";
        });
        return result ? result.long_name : null;
    };

    toCity($event) {
        let google = window['google'];
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': this.city }, (results, status) => {
            if (status === 'OK') {
                let result = results[0].geometry.bounds;
                // this.coords.lng = (result.b.b + result.b.f) / 2;
                // this.coords.lat = (result.f.b + result.f.f) / 2;
                let bounds = new google.maps.LatLngBounds();
                bounds.extend(new google.maps.LatLng(result.f.b, result.b.b));
                bounds.extend(new google.maps.LatLng(result.f.f, result.b.f));
                this.bounds = bounds;
            }
        });

    }

    openCreateOffer4Page() {
        this.offer.city = this.city;
        this.offer.country = this.country//to do
        this.offer.radius = 30000;//todo
        this.offer.longitude = this.coords.lng;//to do(from place)
        this.offer.latitude = this.coords.lat;//to do(from place)
        debugger
        this.nav.push(CreateOffer4Page, { offer: this.offer });
    }

}
