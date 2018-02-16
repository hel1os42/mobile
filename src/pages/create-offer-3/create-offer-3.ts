import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { latLng, LeafletEvent, tileLayer } from 'leaflet';
import { Map } from 'leaflet';
import { Coords } from '../../models/coords';
import { Offer } from '../../models/offer';
import { GeocodeService } from '../../providers/geocode.service';
import { MapUtils } from '../../utils/map.utils';
import { CreateOffer4Page } from '../create-offer-4/create-offer-4';


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
    country: string;
    picture_url: string;
    tileLayer;
    _map: Map;
    options;
    zoom: number;
    radius: number;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private geocoder: GeocodeService,
        private changeDetectorRef: ChangeDetectorRef) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        
        this.radius = this.offer.radius;
        this.zoom = MapUtils.round(MapUtils.getZoom(this.offer.latitude, this.radius, 95), 0.5);
        this.coords.lat = this.offer.latitude;
        this.coords.lng = this.offer.longitude;
        this.addMap();
        this.geocoder.getAddress(this.coords.lat, this.coords.lng)
            .subscribe(data => {
                let address = data.address;
                this.city = address.city || address.town || address.county || address.state;
                this.country = address.country;
            })
    }

    addMap() {
        this.tileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 1,
            maxNativeZoom: 18,
            attribution: '© OpenStreetMap',
            tileSize: 512,
            zoomOffset: -1,
            detectRetina: true,
        });
        this.options = {
            layers: [this.tileLayer],
            zoom: this.zoom,
            center: latLng(this.coords),
            zoomSnap: 0.5,
            zoomDelta: 0.5
        };
    }

    onMapReady(map: Map) {
        this._map = map;
        this._map.on({
            moveend: (event: LeafletEvent) => {
                this.coords = this._map.getCenter();
                if (this.coords.lng > 180 || this.coords.lng < -180) {
                    this.coords.lng = MapUtils.correctLng(this.coords.lng);
                    this._map.setView(this.coords, this._map.getZoom());    
                }
                this.geocoder.getAddress(this.coords.lat, this.coords.lng)
                .subscribe(data => {
                    let address = !data.error ? data.address: undefined;
                        this.city = address 
                        ? (address.city || address.town || address.county || address.state)
                        : undefined;
                        this.country = address ? address.country : undefined;
                    this.changeDetectorRef.detectChanges();
                })
                this.radius = MapUtils.getRadius(95, this._map);
                this.zoom = map.getZoom();
            }
        })
    }

    openCreateOffer4Page() {
        this.offer.latitude = this.coords.lat;
        this.offer.longitude = this.coords.lng;
        this.offer.radius = Math.round(this.radius);
        this.offer.city = this.city;
        this.offer.country = this.country;
        this.nav.push(CreateOffer4Page, { offer: this.offer, picture: this.picture_url });
    }

}
