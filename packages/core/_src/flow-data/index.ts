// Actions
export * from './actions/mouse-flow-data.schema';
export * from './actions/trigger-flow-data.schema';
// Getters
export * from './getters/buffer-getter.schema';
export * from './getters/value-getter.schema';
// Testpoints
export * from './testpoints/compare.schema';
// Tools
export * from './tools/type-parse.schema';

import { z } from 'zod';
import { MouseFlowDataSchema } from './actions/mouse-flow-data.schema';
import { TriggerFlowDataSchema } from './actions/trigger-flow-data.schema';
import { BufferGetterFlowDataSchema } from './getters/buffer-getter.schema';
import { ValueGetterFlowDataSchema } from './getters/value-getter.schema';
import { CompareFlowDataSchema } from './testpoints/compare.schema';
import { TypeParseFlowDataSchema } from './tools/type-parse.schema';

export const AllFlowDataSchema = z.union([
   MouseFlowDataSchema,
   TriggerFlowDataSchema,
   BufferGetterFlowDataSchema,
   ValueGetterFlowDataSchema,
   CompareFlowDataSchema,
   TypeParseFlowDataSchema,
]);
export type AllFlowData = z.infer<typeof AllFlowDataSchema>;

/**
 * 校验 FlowData 数据
 * @param data FlowData 数据
 * @returns null | string[]
 * - null: 校验通过
 * - string[]: 校验失败，返回错误信息
 */
export function validateFlowData(data: AllFlowData[]) {
   const errors: string[] = [];
   data.forEach((item, index) => {
      const result = AllFlowDataSchema.safeParse(item);
      if (!result.success) {
         const msg = result.error.issues
            .map((issue) => issue.message)
            .join('; ');
         errors.push(`Error at index ${index}: ${msg}`);
      }
   });
   return errors.length > 0 ? errors : null;
}
