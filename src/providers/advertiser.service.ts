import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class AdvertiserService {

    constructor(private api: ApiService) { }
}