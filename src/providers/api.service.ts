import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers, Response } from '@angular/http';
import { ToastController, LoadingController, Loading } from "ionic-angular";
import { Observable } from "rxjs";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import { TokenService } from "./token.service";

@Injectable()
export class ApiService {
    HTTP_STATUS_CODE_UNATHORIZED = 401;
    HTTP_STATUS_CODE_TOO_MANY_REQ = 429;
    url: string = 'https://nau.toavalon.com';

    constructor(
        private http: Http,
        private toast: ToastController,
        private loading: LoadingController,
        private token: TokenService) {
    }

    private getOptions(options: RequestOptions): RequestOptions {
        let token = this.token.get();

        if (!token)
            return options;

        if (!options)
            options = new RequestOptions();

        if (!options.headers)
            options.headers = new Headers();

        options.headers.append('Authorization', `Bearer ${token.token}`);

        return options;
    }

    private wrapObservable(obs: Observable<Response>, showLoading: boolean = true) {
        let loading: Loading;
        
        /*if (showLoading) {
            loading = this.loading.create({ content: '' });
            loading.present();
        }*/

        let sharableObs = obs.share();

        sharableObs
            .finally(() => {
                if (loading)
                    loading.dismiss();
            })
            .subscribe(
                resp => { },
                errResp => {
                    if (errResp.status == this.HTTP_STATUS_CODE_UNATHORIZED) {
                        this.token.remove();
                        return;
                    }                

                    let messages = [];

                    if (errResp.status == this.HTTP_STATUS_CODE_TOO_MANY_REQ) {
                        messages.push('Too Many Attempts.')
                    }
                    else
                    {
                        let err = errResp.json();

                        if (err.error && err.message) {
                            messages.push(err.message)
                        }
                        else {
                            for (let key in err) {
                                let el = err[key];
                                for (let i = 0; i < el.length; i++) {
                                    let msg = el[i];
                                    messages.push(msg);
                                }
                            }
                        }
                    }

                    if (messages.length == 0) {
                        messages.push('Unexpected error occured');
                    }

                    let toast = this.toast.create({
                        message: messages.join('\n'),
                        duration: 5000,
                        position: 'bottom',
                        dismissOnPageChange: true
                    });
                    toast.present();
                });

        return sharableObs.map(resp => resp.json());
    }    

    get(endpoint: string, showLoading: boolean = true, params?: any, options?: RequestOptions) {
        if (!options) {
            options = new RequestOptions();
        }

        // support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            // set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return this.wrapObservable(
            this.http.get(this.url + '/' + endpoint, this.getOptions(options)),
            showLoading
        );
    }

    post(endpoint: string, body: any, options?: RequestOptions) {
        return this.wrapObservable(
            this.http.post(this.url + '/' + endpoint, body, this.getOptions(options)));
    }

    put(endpoint: string, body: any, options?: RequestOptions) {
        return this.wrapObservable(
            this.http.put(this.url + '/' + endpoint, body, this.getOptions(options)));
    }

    delete(endpoint: string, options?: RequestOptions) {
        return this.wrapObservable(
            this.http.delete(this.url + '/' + endpoint, this.getOptions(options)));
    }

    patch(endpoint: string, body: any, options?: RequestOptions) {
        return this.wrapObservable(
            this.http.put(this.url + '/' + endpoint, body, this.getOptions(options)));
    }
}