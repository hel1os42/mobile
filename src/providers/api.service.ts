import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Injectable } from '@angular/core';
import { Headers, Http, QueryEncoder, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { Loading, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AppModeService } from './appMode.service';
import { ToastService } from './toast.service';
import { TokenService } from './token.service';

interface ApiRequestOptions {
    showLoading?: boolean;
    params?: any;
    options?: RequestOptions;
    ignoreHttpNotFound?: boolean;
}

class UriQueryEncoder extends QueryEncoder {
    encodeKey(k: string): string {
        return k;
    }

    encodeValue(v: string): string {
        return encodeURIComponent(v);
    }
}

@Injectable()
export class ApiService {
    HTTP_STATUS_CODE_UNATHORIZED = 401;
    HTTP_STATUS_CODE_TOO_MANY_REQ = 423;
    HTTP_STATUS_CODE_PAGE_NOT_FOUND = 404;
    prodUrl = 'https://api.nau.io';
    devUrl = 'https://nau.toavalon.com';
    testUrl = 'https://api-test.nau.io';
    url: string;
    environmentMode: string;

    constructor(
        private http: Http,
        private toast: ToastService,
        private loading: LoadingController,
        private token: TokenService,
        private fileTransfer: FileTransfer,
        private appMode: AppModeService) {

        if (this.appMode.getEnvironmentMode()) {
            this.environmentMode = this.appMode.getEnvironmentMode();
        }
        else {
            this.environmentMode = 'prod';
            this.appMode.setEnvironmentMode(this.environmentMode);
        }

        this.url = (this.environmentMode == 'prod') ? this.prodUrl
            : this.environmentMode == 'test' ? this.testUrl
                : this.devUrl;
        this.appMode.onEnvironmentMode
            .subscribe(resp => {
                this.url = resp == 'prod' ? this.prodUrl
                    : resp == 'test' ? this.testUrl
                        : this.devUrl;
            })
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

    private wrapObservable(obs: Observable<Response>, requestOptions?: ApiRequestOptions) {
        let loading: Loading;

        if (!requestOptions)
            requestOptions = {};

        let showLoading = requestOptions.showLoading
            || typeof (requestOptions.showLoading) == 'undefined';

        if (showLoading) {
            loading = this.loading.create({ content: '' });
            loading.present();
        }

        let sharableObs = obs.share();

        sharableObs
            .finally(() => {
                if (loading)
                    loading.dismiss();
            })
            .subscribe(
                resp => { },
                errResp => {
                    let messages = [];
                    if (errResp.status == this.HTTP_STATUS_CODE_UNATHORIZED) {
                        let err = errResp.json();
                        messages.push(err.message);
                        this.toast.show(messages.join('\n'));
                        setTimeout(() => this.token.remove('HTTP_STATUS_CODE_UNATHORIZED'), 3000);
                        return;
                    }
                    if (errResp.status == this.HTTP_STATUS_CODE_TOO_MANY_REQ) {
                        let err = errResp.json();
                        messages.push(err.phone);
                    }
                    else if (errResp.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && requestOptions.ignoreHttpNotFound) {
                        return;
                    }
                    else {
                        let err = errResp.json();

                        if (err.error && err.message) {
                            messages.push(err.message)
                        }
                        else {
                            if (errResp.status == 0) {
                                messages.push('Internet disconnected');
                                // this.network.setStatus(false);
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
                    }

                    if (messages.length == 0) {
                        messages.push('Unexpected error occured');
                    }

                    this.toast.show(messages.join('\n'), errResp.status == 0);
                });

        // return sharableObs.map(resp => resp.json());
        return sharableObs.map(resp => {
            let obj = resp.json();
            if (obj) {
                obj.http_headers = resp.headers;
            }
            return obj;
        })
    }

    get(endpoint: string, requestOptions?: ApiRequestOptions) {
        if (!requestOptions)
            requestOptions = {};
        let { params, options } = requestOptions;

        if (!options) {
            options = new RequestOptions();
        }

        // support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams(undefined, new UriQueryEncoder());
            for (let k in params) {
                p.set(k, params[k]);
            }
            // set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return this.wrapObservable(
            this.http.get(this.url + '/' + endpoint, this.getOptions(options)),
            requestOptions
        );
    }

    post(endpoint: string, body: any, requestOptions?: ApiRequestOptions) {
        let options = requestOptions ? requestOptions.options : undefined;
        return this.wrapObservable(
            this.http.post(this.url + '/' + endpoint, body, this.getOptions(options)), requestOptions);
    }

    put(endpoint: string, body: any, requestOptions?: ApiRequestOptions) {
        let options = requestOptions ? requestOptions.options : undefined;
        return this.wrapObservable(
            this.http.put(this.url + '/' + endpoint, body, this.getOptions(options)), requestOptions);
    }

    delete(endpoint: string, requestOptions?: ApiRequestOptions) {
        let options = requestOptions ? requestOptions.options : undefined;
        return this.wrapObservable(
            this.http.delete(this.url + '/' + endpoint, this.getOptions(options)), requestOptions);
    }

    patch(endpoint: string, body: any, requestOptions?: ApiRequestOptions) {
        let options = requestOptions ? requestOptions.options : undefined;
        return this.wrapObservable(
            this.http.patch(this.url + '/' + endpoint, body, this.getOptions(options)), requestOptions);
    }

    uploadImage(filePath, path, isShowLoading: boolean) {
        let token = this.token.get();

        let options: FileUploadOptions = {
            fileKey: 'picture',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`
            }
        };

        let loading = this.loading.create({ content: 'Uploading image...' });
        if (isShowLoading) loading.present();

        let transfer = this.fileTransfer.create();
        return transfer.upload(filePath, this.url + '/' + path, options)
            .then(resp => {
                if (isShowLoading) loading.dismiss();
            })
            .catch(err => {
                if (isShowLoading) loading.dismiss();
                this.toast.show(JSON.stringify(err));
            });
    }
}
