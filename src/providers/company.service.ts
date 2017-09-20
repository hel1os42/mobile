import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OfferCreate } from '../models/offerCreate';
import { Observable } from 'rxjs';
import { MockCompanies } from '../mocks/mockCompanies';

@Injectable()
export class CompanyService {

    constructor(private api: ApiService) { }

    get(id) {
        return this.api.get('company', id);
    }

    getCompanies() {
        // TO DO 
        // return this.api.get('companies');
        return Observable.of(MockCompanies.items);
    }
}