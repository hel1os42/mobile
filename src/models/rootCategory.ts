import { RetailType } from "./retailType";
import { Tag } from "./tag";

export class RootCategory {
    id: string;
    name: string;
    children_count: number;
    parent?: any;
    retail_types: RetailType[];
    parent_id: string;
    pivot;
    tags?: Tag[];
}