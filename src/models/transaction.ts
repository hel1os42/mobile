import { Account } from "./account";

export class Transaction {
amount: number;
status: string;
created_at: string;
updated_at: string;
txid_main;
type: string;
id: string;
source_account_id: string;
destination_account_id: string;
source?: Account;
destination?: Account;
}