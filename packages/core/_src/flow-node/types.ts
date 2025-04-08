export type RunTaskResult =
   | {
        status: 'success' | 'fail';
        value: any;
        message: string;
        score?: number;
     }
   | 'start'
   | 'end';

export type Task<ENV extends Record<string, any>> = (
   env: ENV,
   ...args: any[]
) => Promise<RunTaskResult>;

export interface IFlowData<
   ENV extends Record<string, any> = Record<string, any>,
> {
   name: string;
   runTask: Task<ENV>;
   output: string;
   deps: string[];
}
