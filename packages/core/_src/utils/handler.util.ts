import { Page } from 'playwright';
import { AllFlowData } from '../flow-data';
import { BasicEnvironment } from '../flow-handler/index';

export type Result = {
   status: 'success' | 'fail';
   message: string;
   value?: any;
   score?: number;
};

export type FlowHandler<
   T extends AllFlowData,
   ENV extends BasicEnvironment = BasicEnvironment,
> = (options: {
   env: ENV;
   page: Page;
   data: T;
   depsMap: Map<string, any>;
}) => Promise<Result> | Result;
