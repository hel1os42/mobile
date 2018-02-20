import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs";
import { ToastService } from './toast.service';
import { NetworkService } from './network.service';


@Injectable()
export class LocationService {
    geoposition: Geoposition;
    url = 'https://freegeoip.net/json/';

    constructor(private geolocation: Geolocation,
                private http: Http,
                private toast: ToastService,
                private network: NetworkService) { }

    get(isHighAccuracy: boolean) {
        // if (this.geoposition)
        //     return Promise.resolve(this.geoposition);
        // else
            return this.geolocation.getCurrentPosition({
                enableHighAccuracy: isHighAccuracy,
                timeout: 45000,
                maximumAge: 4000, 
            }).then(geo => this.geoposition = geo);
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
                    this.network.setStatus(false);
                }
                let messages = [];
                let err = errResp.json();
                messages.push(err.errorMessage);
                this.toast.show(messages.join('\n'));
            })
        return sharableObs.map(resp => resp.json());
    }

    reset() {
        this.geoposition = undefined;
    }

}