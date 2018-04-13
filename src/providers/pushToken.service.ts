import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class PushTokenService {

    constructor(private api: ApiService) {
    }
}