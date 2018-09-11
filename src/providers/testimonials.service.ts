import { EventEmitter, Injectable } from '@angular/core';
import { TestimonialCreate } from '../models/testimonialCreate';
import { ApiService } from './api.service';


@Injectable()
export class TestimonialsService {

    onRefresh = new EventEmitter<any>();

    constructor(private api: ApiService) { }

    get(placeId: string, page: number) {
        return this.api.get(`places/${placeId}/testimonials?page=${page}`, { showLoading: false });
    }

    post(placeId: string, testimonial: TestimonialCreate) {
        let obs = this.api.post(`places/${placeId}/testimonials`, testimonial, { showLoading: false });
        obs.subscribe(resp => this.onRefresh.emit(resp));
        return obs;
    }

}