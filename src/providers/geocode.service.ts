import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ToastService } from './toast.service';
import { SYS_OPTIONS } from '../const/i18n.const';


@Injectable()
export class GeocodeService {

    url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2';

    constructor(private http: Http,
        private toast: ToastService) {

    }

    getAddress(lat: number, lng: number, isLang?: boolean, isZoom?: boolean) {
        let lang = SYS_OPTIONS.LANG_CODE;
        if (isLang) {
            this.url = this.url + `&accept-language=${lang}`;
        }
        if (isZoom) {
            this.url = this.url + `&zoom=10`;
        }
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
                this.toast.show('Service unavailable')
                console.log(messages.join('\n'));
            })
        return sharableObs.map(resp => resp.json());
    }

}