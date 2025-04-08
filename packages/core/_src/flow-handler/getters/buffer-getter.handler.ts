import { z } from 'zod';
import {
   BufferGetterFlowData,
   GetElScreenshotType,
   GetStdScreenshotType,
} from '../../flow-data';
import { FlowHandler } from '../../utils/handler.util';
import { getElementOrThrow } from '../../utils/check.util';

/**
 * 获取标准答案中某个元素的截图，称为标准截图。
 *
 * 在预执行模式下，会截取指定元素图片并返回；而执行模式下，则从
 * 环境中取得 Buffer
 *
 * @returns 图片 Buffer
 */
const getStdScreenshotHandler: FlowHandler<GetStdScreenshotType> = async ({
   page,
   data: { deps, output },
   depsMap,
   env,
}) => {
   const params = deps.map((dep) => {
      if ('value' in dep) {
         return dep.value;
      } else {
         const { source, key } = dep;
         return depsMap.get(source)?.[key];
      }
   });
   const [selector] = z.tuple([z.string()]).parse(params);
   // 非预执行模式下，直接从 screenshotsMap 中读取标准图 Buffer
   if (!env.IS_PRE) {
      const screenshot = env.preStore.screenshotsMap[output];
      if (!screenshot) {
         throw new Error('标准截图不存在');
      }
      return {
         message: `获取${selector}的标准答案截图::ok`,
         status: 'success',
         value: screenshot,
         __ignore__: true,
      };
   }
   // 预执行模式下，截取指定元素的图片并将 Buffer 返回
   const element = await getElementOrThrow(page, selector);
   const buffer = await element.screenshot();
   return {
      message: `生成${selector}的标准答案截图::ok`,
      status: 'success',
      value: buffer,
   };
};

/**
 * 截取指定元素的截图并返回
 * @returns  图片 Buffer
 */
const getElScreenshotSchema: FlowHandler<GetElScreenshotType> = async ({
   page,
   data: { deps },
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
   const [selector] = z.tuple([z.string()]).parse(params);
   const element = await getElementOrThrow(page, selector);
   const buffer = await element.screenshot();
   return {
      message: `获取${selector}的截图::ok`,
      status: 'success',
      value: buffer,
   };
};

/**
 * 处理 Buffer 获取操作
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
export const handleBufferGetterFlowData: FlowHandler<
   BufferGetterFlowData
> = async (options) => {
   const { action } = options.data;
   switch (action) {
      case 'get-std-screenshot':
         return getStdScreenshotHandler(options as any);
      case 'get-el-screenshot':
         return getElScreenshotSchema(options as any);
      default:
         throw new Error(`不支持的 action: ${action}`);
   }
};
