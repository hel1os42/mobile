export class OfferCategory {
    id: string;
    name: string;
    parent_id?: string;
    children_count?: number;
    image_url?: string;

    static StaticList: OfferCategory[] = [
        {
            id: 'Food&Drinks',
            name: 'Food & Drinks',
            image_url: 'assets/img/splash_screen/tab-icon1.svg'
        },
        {
            id: 'Beauty&Fitness',
            name: 'Beauty & Fitness',
            image_url: 'assets/img/splash_screen/tab-icon2.svg'
        },
        {
            id: 'Retail&Services',
            name: 'Retail & Services',
            image_url: 'assets/img/splash_screen/tab-icon3.svg'
        },
        {
            id: 'Attraction&Leisure',
            name: 'Attraction & Leisure',
            image_url: 'assets/img/splash_screen/tab-icon4.svg'
        },
        {
            id: 'Online&Others',
            name: 'Online & Others',
            image_url: 'assets/img/splash_screen/tab-icon5.svg'
        }
    ];
}