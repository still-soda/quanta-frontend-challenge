import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 移动到点
// deps: [x, y]
export const MoveToSchema = FlowDataSchema.extend({
   action: z.literal('move-to'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type MoveToType = z.infer<typeof MoveToSchema>;

// 移动到某个元素
// deps: [selector]
export const MoveToElSchema = FlowDataSchema.extend({
   action: z.literal('move-to-el'),
   deps: z.tuple([DepSchema]),
});
export type MoveToElType = z.infer<typeof MoveToElSchema>;

// 点击某处
// deps: [button, count, x, y]
export const ClickAtSchema = FlowDataSchema.extend({
   action: z.literal('click-at'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema, DepSchema]),
});
export type ClickAtType = z.infer<typeof ClickAtSchema>;

// 点击某个元素
// deps: [button, count, selector]
export const ClickElSchema = FlowDataSchema.extend({
   action: z.literal('click-el'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema]),
});
export type ClickElType = z.infer<typeof ClickElSchema>;

// 滚动
// deps: [deltaX, deltaY]
export const ScrollSchema = FlowDataSchema.extend({
   action: z.literal('scroll'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type ScrollType = z.infer<typeof ScrollSchema>;

// 鼠标事件，从此导出
export const MouseFlowDataSchema = z.discriminatedUnion('action', [
   MoveToSchema,
   MoveToElSchema,
   ClickAtSchema,
   ClickElSchema,
   ScrollSchema,
]);
export type MouseFlowData = z.infer<typeof MouseFlowDataSchema>;
