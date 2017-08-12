import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers, Response } from '@angular/http';
import { ToastController, LoadingController } from "ionic-angular";
import { Observable } from "rxjs";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import { TokenService } from "./token.service";

@Injectable()
export class ApiService {
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

  private subscribeErrorHandler(obs: Observable<Response>) {
    let loading = this.loading.create({
      content: ''
    });

    loading.present();

    let sharableObs = obs.share();

    sharableObs
      .finally(() => loading.dismiss())
      .subscribe(
        resp => { },
        errResp => {
          let messages = [];
          let err = errResp.json();        

          if (err.error) {
            messages.push(err.error)
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

  get(endpoint: string, params?: any, options?: RequestOptions) {
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

    return this.subscribeErrorHandler(
      this.http.get(this.url + '/' + endpoint, this.getOptions(options)));
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.subscribeErrorHandler(
      this.http.post(this.url + '/' + endpoint, body, this.getOptions(options)));
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.subscribeErrorHandler(
      this.http.put(this.url + '/' + endpoint, body, this.getOptions(options)));
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.subscribeErrorHandler(
      this.http.delete(this.url + '/' + endpoint, this.getOptions(options)));
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.subscribeErrorHandler(
      this.http.put(this.url + '/' + endpoint, body, this.getOptions(options)));
  }
}