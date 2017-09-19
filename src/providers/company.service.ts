import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";

@Injectable()
export class CompanyService {

    constructor(private api: ApiService) {}

    get(id) {
        return this.api.get('company', id);
    }

    getCompanies() {
        return this.api.get('companies')
    }


}