import { Company } from "../models/company";

export class MockCompanies {
    public static items: Company[] = [
        {
            id: '1',
            name: 'The Fair Food',
            description: 'Double Up Food Bucks is a national model for healthy food incentives active in more than 20 states.',
            about: '<div class="text-3E4B5D bold font-18">About our beautiful place</div> <div class="text-828282 font-12 regular margin-top-10 margin-bottom-10">To provide the proper credit, use the embedded credit already in the icon you downloaded, or you can copy the attribution text and add it to your citations, about page, or place in which you would credit work you did not create.</div> <img width="100%" src="assets/img/place/about.png">',
            testimonials_count: 1,
            testimonials: [
                {
                    id: '1',
                    name: 'Emilly',
                    avatar_url: 'assets/img/place/ava_person.png',
                    date: '19/09/2017',
                    text: 'Some of our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner.'
                },
                {
                    id: '2',
                    name: 'Nikolas',
                    avatar_url: 'assets/img/user_users/ava1.png',
                    date: '18/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
                {
                    id: '3',
                    name: 'Ivan',
                    avatar_url: 'assets/img/user_users/ava2.png',
                    date: '20/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
            ],
            categories_count: 2,
            categories: [
                { id: 'Beauty&Fitness', name: 'Bakery', children_count: 0 },
                { id: '2', name: 'Burger', children_count: 0 }
            ],
            offers_count: 3,
            offers: null,
            stars: 4,
            is_featured: true,
            is_starred: true,
            image_url: 'assets/img/user_home/image1.png',
            address: 'Ukraine',
            latitude: 50.466430,
            longitude: 30.669317,
            radius: 500
        },
        {
            id: '2',
            name: 'Sandwich Qween',
            description: 'A sandwich is a food typically consisting of vegetables',
            about: '<div class="text-3E4B5D bold font-18">About our beautiful place</div> <div class="text-828282 font-12 regular margin-top-10 margin-bottom-10">To provide the proper credit, use the embedded credit already in the icon you downloaded, or you can copy the attribution text and add it to your citations, about page, or place in which you would credit work you did not create.</div> <img width="100%" src="assets/img/place/about.png">',
            testimonials_count: 1,
            testimonials: [
                {
                    id: '1',
                    name: 'Emilly',
                    avatar_url: 'assets/img/place/ava_person.png',
                    date: '19/09/2017',
                    text: 'Some of our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner.'
                },
                {
                    id: '2',
                    name: 'Nikolas',
                    avatar_url: 'assets/img/user_users/ava1.png',
                    date: '18/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
                {
                    id: '3',
                    name: 'Ivan',
                    avatar_url: 'assets/img/user_users/ava2.png',
                    date: '20/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
            ],
            categories_count: 2,
            categories: [
                { id: 'Food&Drinks', name: 'Sandwitch', children_count: 0 },
                { id: '4', name: 'Coffee', children_count: 0 }
            ],
            offers_count: 3,
            offers: null,
            stars: 5,
            is_featured: false,
            is_starred: true,
            image_url: 'assets/img/user_home/image1.png',
            address: 'Ukraine',
            latitude: 50.566430,
            longitude: 30.469317,
            radius: 500
        },
        {
            id: '3',
            name: 'Coffee Shop',
            description: 'European food and coffee',
            about: '<div class="text-3E4B5D bold font-18">About our beautiful place</div> <div class="text-828282 font-12 regular margin-top-10 margin-bottom-10">To provide the proper credit, use the embedded credit already in the icon you downloaded, or you can copy the attribution text and add it to your citations, about page, or place in which you would credit work you did not create.</div> <img width="100%" src="assets/img/place/about.png">',
            testimonials_count: 1,
            testimonials: [
                {
                    id: '1',
                    name: 'Emilly',
                    avatar_url: 'assets/img/place/ava_person.png',
                    date: '19/09/2017',
                    text: 'Some of our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner.'
                },
                {
                    id: '2',
                    name: 'Nikolas',
                    avatar_url: 'assets/img/user_users/ava1.png',
                    date: '18/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
                {
                    id: '3',
                    name: 'Ivan',
                    avatar_url: 'assets/img/user_users/ava2.png',
                    date: '20/09/2017',
                    text: 'Our Services allow you to upload, add, store, send or receive content. At the same time, all rights to intellectual property in relation to these materials remain with their owner. Simply put, everything that was yours will remain so.'
                },
            ],
            categories_count: 2,
            categories: [
                { id: '5', name: 'European Food', children_count: 0 },
                { id: '4', name: 'Coffee', children_count: 0 }
            ],
            offers_count: 3,
            offers: null,
            stars: 3,
            is_featured: true,
            is_starred: true,
            image_url: 'assets/img/user_home/image2.png',
            address: 'Ukraine',
            latitude: 50.539430,
            longitude: 30.467317,
            radius: 1000
        }
    ];
};