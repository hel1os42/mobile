import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { UserAccount } from "../models/userAccount";

@Injectable()
export class ProfileService {
    
    constructor(private api: ApiService ) { }

    get() {
        return this.api.get('profile');
    }

    set(account: UserAccount) {
        return Observable.of({ success: true });
        //this.api.post('', account);
    }
}