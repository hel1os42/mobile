import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { PushTokenCreate } from "../models/pushTokenCreate";

@Injectable()
export class PushTokenService {

    constructor(private api: ApiService) {}

    get(deviceId) {
        return this.api.get(`push-token/${deviceId}`, { 
            showLoading: false, 
            ignoreHttpNotFound: true 
        });
    }

    post(pushToken: PushTokenCreate) {
        return this.api.post('push-token', pushToken, { 
            showLoading: false,
            ignoreHttpNotFound: true 
         });
    }
}