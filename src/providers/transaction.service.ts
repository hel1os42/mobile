import { Injectable, EventEmitter } from "@angular/core";
import { ApiService } from "./api.service";
import { TransactionCreate } from "../models/transactionCreate";
import { AdjustService } from "./adjust.service";

@Injectable()
export class TransactionService {
    onRefreshTransactions: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private api: ApiService,
        private adjust: AdjustService) { }

    getList(page) {
        return this.api.get('transactions', {
            showLoading: page == 1,
            params: {
                with: 'source;destination',
                orderBy: 'created_at',
                sortedBy: 'desc',
                page: page
            }
        });
    }

    set(transaction: TransactionCreate, showLoading?: boolean) {
        let obs = this.api.post('transactions', transaction, { showLoading: showLoading });
        obs.subscribe(() => this.adjust.setEvent('NAU_TX_SEND'),
            err => { });
        return obs;
    }

    refresh() {
        this.getList(1).subscribe(transactions => this.onRefreshTransactions.emit(transactions));
    }

}