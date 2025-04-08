import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 数值比较
// deps: [value1, value2, operator]
export const ValueCompareSchema = FlowDataSchema.extend({
   action: z.literal('value-compare'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema]),
   name: z.string(),
   score: z.number(),
});
export type ValueCompareType = z.infer<typeof ValueCompareSchema>;

// Buffer比较
// deps: [buffer1, buffer2, threshold]
export const BufferCompareSchema = FlowDataSchema.extend({
   action: z.literal('buffer-compare'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema]),
   name: z.string(),
   score: z.number(),
});
export type BufferCompareType = z.infer<typeof BufferCompareSchema>;

export const CompareFlowDataSchema = z.discriminatedUnion('action', [
   ValueCompareSchema,
   BufferCompareSchema,
]);
export type CompareFlowData = z.infer<typeof CompareFlowDataSchema>;
