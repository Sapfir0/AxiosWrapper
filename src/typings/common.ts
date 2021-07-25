export type RequestSettings = {
    stringify?: boolean; 
    multipartData?: boolean;
};

export interface IDataIndex {
    [name: string]: any;
}

export type IData = IDataIndex | FormData