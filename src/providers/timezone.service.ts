import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable()
export class TimezoneService {

    GOOGLE_API_KEY = 'AIzaSyBDIVqRKhG9ABriA2AhOKe238NZu3cul9Y';
    url: string = 'https://maps.googleapis.com/maps/api/timezone/json?';

    constructor(private http: Http,
        private toast: ToastService) { }

    get(lat: number, lng: number, timestamp: number) {
            return this.wrapObservable(this.http.get(
                this.url + `location=${lat}, ${lng}&timestamp=${timestamp}&key=${this.GOOGLE_API_KEY}`
            ));
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
}