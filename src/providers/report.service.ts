import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Complaint } from "../models/complaint";

@Injectable()
export class ReportService {

    constructor(private api: ApiService) {

    }

    set(placeId: string, complaint: Complaint) {
        return this.api.post(`places/${placeId}/complaints`, complaint);
    }
}