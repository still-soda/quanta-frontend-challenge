import { ZodSchema } from 'zod';
import { AllFlowData } from '../flow-data';
import { FlowHandler } from './handler.util';
import { Page } from 'playwright';
import { BasicEnvironment } from '../flow-handler';

/**
 * 处理程序类型定义
 */
export type HandlerType = {
   schema: ZodSchema;
   handler: FlowHandler<any>;
};

/**
 * 根据模式将流程数据分发到适当的处理程序。
 * @param flowdata - 要分发的流程数据。
 * @param handlers - 处理程序数组，每个处理程序包含一个模式和一个处理程序函数。
 * @returns 匹配模式的处理程序函数的结果。
 * @throws 如果没有找到匹配的处理程序，则抛出错误。
 */
export const dispatchHandler = <ENV extends BasicEnvironment>(
   flowdata: AllFlowData,
   handlers: HandlerType[],
   options: {
      page: Page;
      env: ENV;
      depsMap: Map<string, any>;
   }
) => {
   for (const { schema, handler } of handlers) {
      const result = schema.safeParse(flowdata);
      if (result.success) {
         return handler({
            ...options,
            data: result.data,
         });
      }
   }
   throw new Error('No matching handler found');
};
