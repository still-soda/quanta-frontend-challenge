import { z } from 'zod';

const DepCase1 = z.object({
   source: z.string(),
   key: z.string(),
});
const DepCase2 = z.object({
   value: z.string(),
});

/**
 * 依赖项数据，描述依赖项的结构和类型
 * @property source - 依赖项来源
 * @property key - 依赖项键
 * @property value - 依赖项值
 */
export const DepSchema = DepCase1.or(DepCase2);
export type Dep = z.infer<typeof DepSchema>;

/**
 * 基础流程数据，描述流程数据的结构和类型
 * @property action - 动作类型
 * @property output - 输出结果
 * @property type - 数据类型
 * @property deps - 依赖项数组
 * @property [score] - 可选的评分
 * @property [name] - 可选的名称
 */
export const FlowDataSchema = z.object({
   action: z.string(),
   output: z.string(),
   type: z.string(),
   deps: DepSchema.array(),
   score: z.number().optional(),
   name: z.string().optional(),
});
export type FlowData = z.infer<typeof FlowDataSchema>;
