import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Complaint } from "../models/complaint";
import { AppModeService } from "./appMode.service";
import { AdjustService } from "./adjust.service";

@Injectable()
export class ReportService {

    constructor(
        private api: ApiService,
        private appMode: AppModeService,
        private adjust: AdjustService) { }

    set(placeId: string, complaint: Complaint) {
        let obs = this.api.post(`places/${placeId}/complaints`, complaint, {
            ignoreHttpUnprocessableEntity: this.appMode.getEnvironmentMode() === 'prod'
        });
        obs.subscribe(() => this.adjust.setEvent('REPORT_SENT'));
        return obs;
    }

}