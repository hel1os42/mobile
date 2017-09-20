import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { OfferCreate } from "../models/offerCreate";
import { Company } from '../models/company';


@Injectable()
export class CompanyService {

    constructor(private api: ApiService) { }

    get(id) {
        return this.api.get('company', id);
    }

    getCompanies() {
        //return this.api.get('companies')to do
       
        let company1, company2, company3: Company = new Company;//temporary 
        let companies: Company[] = [

        company1 = {
            id: "1",
            name: "The Fair Food",
            description: "The modern concept of a sandwich using slices of bread",
            about: null,
            testimonials_count: 1,
            testimonials: "Some of our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner.",
            categories_count: 1,
            categories: null,
            offers_count: 3,
            offers: null,
            stars: 1,
            is_featured: true,
            is_starred: true,
            image_url: "",
            address: "Ukraine",
            latitude: 50.466430,
            longitude: 30.669317,
            radius: 500
        },

        company2 = {
            id: "2",
            name: "Sandwich Qween",
            description: "A sandwich is a food typically consisting of vegetables",
            about: null,
            testimonials_count: 1,
            testimonials: "",
            categories_count: 1,
            categories: null,
            offers_count: 0,
            offers: null,
            stars: 1,
            is_featured: false,
            is_starred: true,
            image_url: "",
            address: "Ukraine",
            latitude: 50.566430,
            longitude: 30.469317,
            radius: 500
        },

        company3 = {
            id: "3",
            name: "Coffee Shop",
            description: "European food and coffee",
            about: null,
            testimonials_count: 1,
            testimonials: "",
            categories_count: 1,
            categories: null,
            offers_count: 0,
            offers: null,
            stars: 1,
            is_featured: true,
            is_starred: true,
            image_url: "",
            address: "Ukraine",
            latitude: 50.539430,
            longitude: 30.467317,
            radius: 1000
        }
    ]
        return companies;
    }

   





}