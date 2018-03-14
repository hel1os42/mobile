import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "./api.service";
import { Testimonial } from "../models/testimonial";


@Injectable()
export class TestimonialsService {

    onRefresh = new EventEmitter<any>();

    constructor(private api: ApiService) {

    }

    get(placeId: string, page: number) {
        return this.api.get(`places/${placeId}/testimonials?page=${page}`);
    }

    post(placeId: string, testimonial: Testimonial) {
        let obs = this.api.post(`places/${placeId}/testimonials`, testimonial);
        obs.subscribe(resp => this.onRefresh.emit(resp));
        return obs;
    }

}