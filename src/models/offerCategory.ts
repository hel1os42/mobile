export class OfferCategory {
    id: string;
    name: string;
    name_html?: string;
    parent_id?: string;
    children_count?: number;
    image_url?: string;
    imageAdvCreate_url?: string;

    static StaticList: OfferCategory[] = [
        {
            id: 'aea58d61-5ad5-4f79-9a2c-819245f56696',
            name: 'Food & Drinks',
            name_html: '<div class="font-65 text-white">Food &<br>Drinks</div>',
            image_url: 'assets/img/splash_screen/tab-icon1.svg',
            imageAdvCreate_url: 'assets/img/category/food.svg'
        },
        {
            id: 'b1c1bdc8-5704-4517-8992-5c68df4b9bc9',
            name: 'Beauty & Fitness',
            name_html: '<div class="font-65 text-white">Beauty &<br>Fitness</div>',
            image_url: 'assets/img/splash_screen/tab-icon2.svg',
            imageAdvCreate_url: 'assets/img/category/beauty.svg'
        },
        {
            id: '2ffaf6e1-bfa1-4af6-8755-6ccf2266cb6b',
            name: 'Retail & Services',
            name_html: '<div class="font-65 text-white">Retail &<br>Services</div>',
            image_url: 'assets/img/splash_screen/tab-icon3.svg',
            imageAdvCreate_url: 'assets/img/category/retail.svg'
        },
        {
            id: '5e860198-f40a-4031-8fc6-f3e67f9d6b0c',
            name: 'Attraction & Leisure',
            name_html: '<div class="font-65 text-white">Attraction<br>& Leisure</div>',
            image_url: 'assets/img/splash_screen/tab-icon4.svg',
            imageAdvCreate_url: 'assets/img/category/attractions.svg'
        },
        {
            id: '69d4ccac-0a2b-423b-97c9-7f560c5c8bdb',
            name: 'Online & Others',
            name_html: '<div class="font-65 text-white">Online &<br>Others</div>',
            image_url: 'assets/img/splash_screen/tab-icon5.svg',
            imageAdvCreate_url: 'assets/img/category/other.svg'
        }
    ];
}