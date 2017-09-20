import { Company } from "../models/company";

export class MockCompanies {
    public static items: Company[] = [
        {
            id: "1",
            name: "The Fair Food",
            description: "The modern concept of a sandwich using slices of bread",
            about: null,
            testimonials_count: 1,
            testimonials: "Some of our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner.",
            categories_count: 2,
            categories: [
                { id: '1', name: 'Bakery', children_count: 0 },
                { id: '2', name: 'Burger', children_count: 0 }
            ],
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
        {
            id: "2",
            name: "Sandwich Qween",
            description: "A sandwich is a food typically consisting of vegetables",
            about: null,
            testimonials_count: 1,
            testimonials: "",
            categories_count: 2,
            categories: [
                { id: '3', name: 'Sandwitch', children_count: 0 },
                { id: '4', name: 'Coffee', children_count: 0 }
            ],
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
        {
            id: "3",
            name: "Coffee Shop",
            description: "European food and coffee",
            about: null,
            testimonials_count: 1,
            testimonials: "",
            categories_count: 2,
            categories: [
                { id: '5', name: 'European Food', children_count: 0 },
                { id: '4', name: 'Coffee', children_count: 0 }
            ],
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
    ];
};