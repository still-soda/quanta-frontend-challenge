import { Page } from 'playwright';
import {
   BufferGetterFlowDataSchema,
   CompareFlowDataSchema,
   AllFlowData,
   MouseFlowDataSchema,
   TriggerFlowDataSchema,
   TypeParseFlowDataSchema,
   ValueGetterFlowDataSchema,
} from '../flow-data';
import { dispatchHandler, HandlerType } from '../utils/dispatch.util';
import { handleMouseFlowData } from './actions/mouse-flow-data.handler';
import { handlerTriggerFlowData } from './actions/trigger-flow-data.handler';
import { handleBufferGetterFlowData } from './getters/buffer-getter.handler';
import { handleValueGetterFlowData } from './getters/value-getter.handler';
import { handleCompareTestpointFlowData } from './testpoints/compare.handler';
import { handleTypeParseFlowData } from './tools/type-parse.handler';

export type BasicEnvironment = {
   /** 是否是预执行 */
   IS_PRE: boolean;
   /** 预执行环境存储结果 */
   preStore: {
      screenshotsMap: Record<string, Buffer>;
   };
};

/**
 * 处理器类型
 */
const HANDLERS: HandlerType[] = [
   {
      schema: MouseFlowDataSchema,
      handler: handleMouseFlowData,
   },
   {
      schema: TriggerFlowDataSchema,
      handler: handlerTriggerFlowData,
   },
   {
      schema: BufferGetterFlowDataSchema,
      handler: handleBufferGetterFlowData,
   },
   {
      schema: ValueGetterFlowDataSchema,
      handler: handleValueGetterFlowData,
   },
   {
      schema: CompareFlowDataSchema,
      handler: handleCompareTestpointFlowData,
   },
   {
      schema: TypeParseFlowDataSchema,
      handler: handleTypeParseFlowData,
   },
];

/**
 * 处理 FlowData
 * @param flowdata FlowData
 * @returns 处理结果
 */
export const handleOneFlowData = <ENV extends BasicEnvironment>(
   flowdata: AllFlowData,
   env: ENV,
   page: Page,
   depsMap: Map<string, any>
) => {
   return dispatchHandler(flowdata, HANDLERS, { env, page, depsMap });
};
