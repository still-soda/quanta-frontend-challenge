import { z } from 'zod';
import { ValueCompareType } from '../../flow-data';
import { FlowHandler } from '../../utils/handler.util';
import {
   BufferCompareType,
   CompareFlowData,
} from '../../flow-data/testpoints/compare.schema';
import { diff, Jimp } from 'jimp';

/**
 * 数值比较处理器
 * @param options
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const valueCompareHandler: FlowHandler<ValueCompareType> = async ({
   data: { deps, name, score },
   depsMap,
}) => {
   const params = deps.map((dep) => {
      if ('value' in dep) {
         return dep.value;
      } else {
         const { source, key } = dep;
         return depsMap.get(source)?.[key];
      }
   });
   const [value1, value2, operator] = z
      .tuple([z.any(), z.any(), z.string()])
      .parse(params);

   let result = false;
   switch (operator) {
      case '===':
         result = value1 === value2;
         break;
      case '!==':
         result = value1 !== value2;
         break;
      case '>':
         result = value1 > value2;
         break;
      case '<':
         result = value1 < value2;
         break;
      case '>=':
         result = value1 >= value2;
         break;
      case '<=':
         result = value1 <= value2;
         break;
      default:
         throw new Error(`不支持的操作符: ${operator}`);
   }

   return {
      value: result,
      score: result ? score : 0,
      message: `[${name}:${score}分]:期望 value1(${value1}) ${operator} value2(${value2})${
         result ? '' : '，实际不成立'
      }`,
      status: result ? 'success' : 'fail',
   };
};

/**
 * 图片比较处理器
 * @param options
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const bufferCompareHandler: FlowHandler<BufferCompareType> = async ({
   data: { deps, score, name },
   depsMap,
}) => {
   const params = deps.map((dep) => {
      if ('value' in dep) {
         return dep.value;
      } else {
         const { source, key } = dep;
         return depsMap.get(source)?.[key];
      }
   });
   const [buffer1, buffer2, threshold] = z
      .tuple([z.instanceof(Buffer), z.instanceof(Buffer), z.number()])
      .parse(params);

   const image1 = await Jimp.read(buffer1);
   const image2 = await Jimp.read(buffer2);

   const { percent } = diff(image1, image2, threshold);
   const similarity = 1 - percent;

   return {
      value: similarity >= threshold,
      score: similarity >= threshold ? score : 0,
      message: `[${name}:${score}分]:期望相似度大于等于 ${threshold}，实际相似度为 ${similarity}`,
      status: similarity >= threshold ? 'success' : 'fail',
   };
};

/**
 * 处理比较操作
 * @param options
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
export const handleCompareTestpointFlowData: FlowHandler<
   CompareFlowData
> = async (options) => {
   const { action } = options.data;
   switch (action) {
      case 'value-compare':
         return valueCompareHandler(options as any);
      case 'buffer-compare':
         return bufferCompareHandler(options as any);
      default:
         throw new Error(`不支持的 action: ${action}`);
   }
};
