import { Injectable, EventEmitter } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs";
import { ToastService } from './toast.service';
import { NetworkService } from './network.service';
import { Coords } from '../models/coords';


@Injectable()
export class LocationService {
    geoposition: Geoposition;
    url = 'https://freegeoip.net/json/';
    onProfileCoordsChanged = new EventEmitter<Coords>();

    constructor(private geolocation: Geolocation,
                private http: Http,
                private toast: ToastService,
                private network: NetworkService) { }

    get(isHighAccuracy: boolean) {
        // if (this.geoposition)
        //     return Promise.resolve(this.geoposition);
        // else
        let promise = this.geolocation.getCurrentPosition({
            enableHighAccuracy: isHighAccuracy,
            timeout: 40000,
            maximumAge: 6000})
        promise.then(geo => this.geoposition = geo);
        return promise;
    }

    getByIp() {
             return this.wrapObservable(this.http.get(this.url));
    }

    wrapObservable(obs: Observable<Response>) {
        let sharableObs = obs.share();
        sharableObs.subscribe(
            resp => { },
            errResp => {
                if (errResp.status == 0) {
                    this.toast.show('Internet disconnected', true);
                    // this.network.setStatus(false);
                }
                let messages = [];
                let err = errResp.json();
                messages.push(err.errorMessage);
                this.toast.show(messages.join('\n'));
            })
        return sharableObs.map(resp => resp.json());
    }

    getCache() {
        let promise: Promise<Geoposition>;
        promise = this.geoposition && this.geoposition.coords.latitude 
        ? Promise.resolve(this.geoposition) 
        : this.get(false);
        return promise;
    }

    refreshDefoultCoords(coords: Coords) {
        this.onProfileCoordsChanged.emit(coords);
    }

    reset() {
        this.geoposition = undefined;
    }

}