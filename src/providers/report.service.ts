import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Complaint } from "../models/complaint";
import { AppModeService } from "./appMode.service";

@Injectable()
export class ReportService {

    constructor(
        private api: ApiService,
        private appMode: AppModeService) {

    }

    set(placeId: string, complaint: Complaint) {
        return this.api.post(`places/${placeId}/complaints`, complaint, { 
            ignoreHttpLeftComplaint: this.appMode.getEnvironmentMode() === 'prod' 
        });
    }
}