import { ZOOM } from '../../const/zoom.const';
import { GeocodeService } from '../../providers/geocode.service';
import { Offer } from '../../models/offer';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Coords } from '../../models/coords';
import { CreateOffer4Page } from '../create-offer-4/create-offer-4';
import { TileLayer, latLng, tileLayer, marker, icon, circle, Marker } from 'leaflet';
import { Map } from 'leaflet'
import { debug } from 'util';


@Component({
    selector: 'page-create-offer-3',
    templateUrl: 'create-offer-3.html'
})
export class CreateOffer3Page {

    offer: Offer;
    coords: Coords = new Coords();
    message: string;
    bounds;
    city: string;
    picture_url: string;
    tileLayer;
    options;
    zoom = 11;
    radius = 5;//km
    layers;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private geocoder: GeocodeService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        if (this.offer.id) {
            this.radius = this.offer.radius / 1000;
            this.zoom = this.getZoom();
        }
        this.coords.lat = this.offer.latitude;
        this.coords.lng = this.offer.longitude;
        this.addMap();
        this.geocoder.getAddress(this.coords.lat, this.coords.lng)
            .subscribe(data => {
                let address = data.address;
                this.city = address.city || address.town || address.county || address.state;
                this.offer.country = address.country;
            })
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            minZoom: 1,
            maxNativeZoom: 18,
            attribution: '...',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
        });
        this.options = {
            zoom: this.zoom,
            center: latLng(this.coords)
        };
        this.layers = [this.tileLayer,
        marker([this.coords.lat, this.coords.lng], {
            icon: icon({
                iconSize: [25, 35],
                iconAnchor: [13, 35],
                iconUrl: 'assets/img/places_pin.png',
                //shadowUrl: 
            })
        }),
        circle([this.coords.lat, this.coords.lng], {
            radius: this.radius * 1000,
            color: '#ff8b10',
            opacity: 0.2,
            stroke: false
        })
        ]
    }
    getRadius() {
        return this.radius * 1000;
    }

    getZoom() {
        this.zoom = ZOOM[this.radius];
        return this.zoom;
    }

    openCreateOffer4Page() {
        this.offer.radius = this.radius * 1000;//todo
        this.offer.city = this.city;
        debugger
        this.nav.push(CreateOffer4Page, { offer: this.offer, picture: this.picture_url });
    }

}
