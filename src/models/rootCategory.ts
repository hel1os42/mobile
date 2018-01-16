import { RetailType } from "./retailType";
import { Tag } from "./tag";

export class RootCategory {

    id: string;
    name: string;
    parent_id?: any;
    children_count: number;
    parent?: any;
    retail_types: RetailType[];
    tags: Tag[];
}