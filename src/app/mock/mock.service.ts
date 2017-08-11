import { Injectable } from '@angular/core';
import { PROPERTIES } from './mock.properties';
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockService {
 
    findAll() {
         return Observable.create(observer => {
            observer.next(PROPERTIES);
            observer.complete();
        });
    }
 
}