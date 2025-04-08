import { z } from 'zod';
import { DepSchema, FlowDataSchema } from '../flow-data.schema';

// 聚焦
// deps: [selector]
export const FocusElSchema = FlowDataSchema.extend({
   action: z.literal('focus-el'),
   deps: z.tuple([DepSchema]),
});
export type FocusElType = z.infer<typeof FocusElSchema>;

// 失焦
// deps: [selector]
export const BlurElSchema = FlowDataSchema.extend({
   action: z.literal('blur-el'),
   deps: z.tuple([DepSchema]),
});
export type BlurElType = z.infer<typeof BlurElSchema>;

// 输入
// deps: [text]
export const InputElSchema = FlowDataSchema.extend({
   action: z.literal('input-el'),
   deps: z.tuple([DepSchema]),
});
export type InputElType = z.infer<typeof InputElSchema>;

// 输入到某个元素
// deps: [selector, text]
export const InputAtElSchema = FlowDataSchema.extend({
   action: z.literal('input-at-el'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type InputAtElType = z.infer<typeof InputAtElSchema>;

// 拖拽点到点
// deps: [startX, startY, endX, endY]
export const DragToSchema = FlowDataSchema.extend({
   action: z.literal('drag-to'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema, DepSchema]),
});
export type DragToType = z.infer<typeof DragToSchema>;

// 拖拽点到某个元素
// deps: [startX, startY, selector]
export const DragToElSchema = FlowDataSchema.extend({
   action: z.literal('drag-to-el'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema]),
});
export type DragToElType = z.infer<typeof DragToElSchema>;

// 拖拽某个元素到点
// deps: [selector, endX, endY]
export const DragElToSchema = FlowDataSchema.extend({
   action: z.literal('drag-el-to'),
   deps: z.tuple([DepSchema, DepSchema, DepSchema]),
});
export type DragElToType = z.infer<typeof DragElToSchema>;

// 拖拽某个元素到某个元素
// deps: [selector, targetSelector]
export const DragElToElSchema = FlowDataSchema.extend({
   action: z.literal('drag-el-to-el'),
   deps: z.tuple([DepSchema, DepSchema]),
});
export type DragElToElType = z.infer<typeof DragElToElSchema>;

// 触发事件
export const TriggerFlowDataSchema = z.discriminatedUnion('action', [
   FocusElSchema,
   BlurElSchema,
   InputElSchema,
   InputAtElSchema,
   DragToSchema,
   DragToElSchema,
   DragElToSchema,
   DragElToElSchema,
]);
export type TriggerFlowData = z.infer<typeof TriggerFlowDataSchema>;
