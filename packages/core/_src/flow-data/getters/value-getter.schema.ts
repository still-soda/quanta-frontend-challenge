import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 读取元素文本内容
// deps: [selector]
export const GetElTextSchema = FlowDataSchema.extend({
   action: z.literal('get-el-text'),
   deps: z.tuple([DepSchema]),
});
export type GetElTextType = z.infer<typeof GetElTextSchema>;

// 读取元素属性内容
// deps: [selector, attr]
export const GetElAttrSchema = FlowDataSchema.extend({
   action: z.literal('get-el-attr'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type GetElAttrType = z.infer<typeof GetElAttrSchema>;

// 读取元素样式内容
// deps: [selector, style]
export const GetElStyleSchema = FlowDataSchema.extend({
   action: z.literal('get-el-style'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type GetElStyleType = z.infer<typeof GetElStyleSchema>;

// 读取元素中心坐标
// deps: [selector]
export const GetElCenterSchema = FlowDataSchema.extend({
   action: z.literal('get-el-center-pos'),
   deps: z.tuple([DepSchema]),
});
export type GetElCenterType = z.infer<typeof GetElCenterSchema>;

export const ValueGetterFlowDataSchema = z.discriminatedUnion('action', [
   GetElTextSchema,
   GetElAttrSchema,
   GetElStyleSchema,
   GetElCenterSchema,
]);
export type ValueGetterFlowData = z.infer<typeof ValueGetterFlowDataSchema>;
