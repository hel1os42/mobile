import { SpecialityCreate } from './specialityCreate';

export class PlaceCreate {
    name: string;
    description: string;
    about: string;
    address: string;
    category?: string;
    retail_types: string[];
    latitude: number;
    longitude: number;
    radius: number;
    tags: string[];
    specialities: SpecialityCreate[];
}
