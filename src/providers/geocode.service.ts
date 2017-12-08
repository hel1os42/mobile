import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import leaflet, { latLng } from 'leaflet';


@Injectable()
export class GeocodeService {

url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2';

constructor(private http: Http) {

}
    
getAddress(lat: number, lng: number) {
    return this.wrapObservable(this.http.get(this.url + `&lat=${lat}&lon=${lng}`));
}

wrapObservable(obs: Observable<Response>) {
    let sharableObs = obs.share();
    sharableObs.subscribe(
        resp => { },
        errResp => {
            let messages = [];
            let err = errResp.json();
            messages.push(err.errorMessage);
           console.log(messages.join('\n'));
        })
    return sharableObs.map(resp => resp.json());
}

}