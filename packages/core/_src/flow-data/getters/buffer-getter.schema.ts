import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 读取标准截图Buffer
// deps: [selector]
export const GetStdScreenshotSchema = FlowDataSchema.extend({
   action: z.literal('get-std-screenshot'),
   deps: z.tuple([DepSchema]),
});
export type GetStdScreenshotType = z.infer<typeof GetStdScreenshotSchema>;

// 读取元素截图Buffer
// deps: [selector]
export const GetElScreenshotSchema = FlowDataSchema.extend({
   action: z.literal('get-el-screenshot'),
   deps: z.tuple([DepSchema]),
});
export type GetElScreenshotType = z.infer<typeof GetElScreenshotSchema>;

export const BufferGetterFlowDataSchema = z.discriminatedUnion('action', [
   GetStdScreenshotSchema,
   GetElScreenshotSchema,
]);
export type BufferGetterFlowData = z.infer<typeof BufferGetterFlowDataSchema>;
