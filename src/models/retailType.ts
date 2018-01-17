import { Speciality } from './speciality';

export class RetailType {

    id: string;
    name: string;
    parent_id: string;
    children_count: number;
    specialities: Speciality[];
    isSelected?: boolean;

}