import { UserAccount } from "./user-account.model";

export interface Chat {
    id:         string;
    user_id:       string;
    message:    string;
    meta_data?:  any;
    created_at?: any;
    updated_at?: any;
    user?: UserAccount
}
