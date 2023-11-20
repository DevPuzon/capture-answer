export interface Chat {
    id:         string;
    user_id:       string;
    message:    string;
    meta_data?:  MetaData;
    created_at?: any;
    updated_at?: any; 
}

export interface MetaData {
}

