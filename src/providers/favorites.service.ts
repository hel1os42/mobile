import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class FavoritesService {

    constructor(private api: ApiService) {
    }
}