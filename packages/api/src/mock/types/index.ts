export interface MockMethod {
   url: string;
   method: 'get' | 'post' | 'put' | 'delete';
   response: (request: {
      headers: Record<string, any>;
      params: Record<string, any>;
      body: Record<string, any>;
      query: Record<string, any>;
   }) => any;
}
