import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable()
export class ProfileService {

    constructor(private api: ApiService ) { }

    get() {
        return this.api.get('profile');
    }
}