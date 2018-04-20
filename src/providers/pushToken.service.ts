import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { PushTokenCreate } from "../models/pushTokenCreate";

@Injectable()
export class PushTokenService {

    constructor(private api: ApiService) {}

    // get(deviceId) {
    //     return this.api.get(`push-token/${deviceId}`, { 
    //         showLoading: false, 
    //         ignoreHttpNotFound: true 
    //     });
    // }

    set(pushToken: PushTokenCreate, push_device: string) {
        return this.api.put(`push_devices/${push_device}`, pushToken, { 
            showLoading: false,
            ignoreHttpNotFound: true 
         });
    }
}