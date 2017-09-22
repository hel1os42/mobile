export class OfferCategory {
    id: string;
    name: string;
    parent_id?: string;
    children_count?: number;
    image_url?: string;

    static StaticList: OfferCategory[] = [
        {
            id: 'aea58d61-5ad5-4f79-9a2c-819245f56696',
            name: 'Food & Drinks',
            image_url: 'assets/img/splash_screen/tab-icon1.svg'
        },
        {
            id: 'b1c1bdc8-5704-4517-8992-5c68df4b9bc9',
            name: 'Beauty & Fitness',
            image_url: 'assets/img/splash_screen/tab-icon2.svg'
        },
        {
            id: '2ffaf6e1-bfa1-4af6-8755-6ccf2266cb6b',
            name: 'Retail & Services',
            image_url: 'assets/img/splash_screen/tab-icon3.svg'
        },
        {
            id: '5e860198-f40a-4031-8fc6-f3e67f9d6b0',
            name: 'Attraction & Leisure',
            image_url: 'assets/img/splash_screen/tab-icon4.svg'
        },
        {
            id: '69d4ccac-0a2b-423b-97c9-7f560c5c8bdb',
            name: 'Online & Others',
            image_url: 'assets/img/splash_screen/tab-icon5.svg'
        }
    ];
}