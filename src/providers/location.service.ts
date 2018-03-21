import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Observable, Subscription } from 'rxjs';
import { Coords } from '../models/coords';
import { NetworkService } from './network.service';
import { ToastService } from './toast.service';
import { ProfileService } from './profile.service';

@Injectable()
export class LocationService {
    geoposition: Geoposition;
    url = 'https://freegeoip.net/json/';
    onProfileCoordsChanged = new EventEmitter<Coords>();
    profileCoords = new Coords;
    onProfileCoordsRefresh: Subscription;

    constructor(private geolocation: Geolocation,
        private http: Http,
        private toast: ToastService,
        private network: NetworkService,
        private profile: ProfileService) {

        this.onProfileCoordsRefresh = this.profile.onRefresh
            .subscribe(resp => {
                this.profileCoords.lat = resp.latitude;
                this.profileCoords.lng = resp.longitude;
            })
    }

    get(isHighAccuracy: boolean) {
        // if (this.geoposition)
        //     return Promise.resolve(this.geoposition);
        // else
        let promise = this.geolocation.getCurrentPosition({
            enableHighAccuracy: isHighAccuracy,
            timeout: 30000,
            maximumAge: 6000
        })
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
        // let promise: Promise<Geoposition>;
        // promise = this.geoposition && this.geoposition.coords.latitude
        //     ? Promise.resolve(this.geoposition)
        //     : this.get(false);
        // return promise;
        return Promise.resolve(
            {
                coords: {
                    latitude: this.profileCoords.lat,
                    longitude: this.profileCoords.lng
                }

            }
        );
    }

    refreshDefaultCoords(coords: Coords, notEmit?: boolean) {
        if (!notEmit) {
            this.onProfileCoordsChanged.emit(coords);
        }
        this.profileCoords = coords;
    }

    reset() {
        this.geoposition = undefined;
    }

}