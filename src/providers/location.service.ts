import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Coords } from "../models/coords";

@Injectable()
export class LocationService {
    geoposition: Geoposition;

    constructor(private geolocation: Geolocation) { }

    get() {
        if (this.geoposition)
            return Promise.resolve(this.geoposition);
        else
            return this.geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            }).then(geo => this.geoposition = geo);
    }
}