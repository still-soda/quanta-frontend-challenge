export interface RequestOptions {
   method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
   body?: BodyInit;
   headers?: HeadersInit;
   query?: { [key: string]: string | number | string[] | number[] };
}

export enum RequestResultStatus {
   SUCCESS = 'request-success',
   ERROR = 'request-error',
}

export interface RequestErrorMsg {
   url: string;
   options: RequestOptions;
   response: Response;
   error: string;
}
