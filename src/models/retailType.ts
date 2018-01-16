import { Specialities } from './specialities';

export class RetailType {

    id: string;
    name: string;
    parent_id: string;
    children_count: number;
    specialities: Specialities[];

}