import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 类型转换工具
// deps: [originValue, type]
export const TypeParseFlowDataSchema = FlowDataSchema.extend({
   action: z.literal('type-parse'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type TypeParseType = z.infer<typeof TypeParseFlowDataSchema>;
