import { z } from 'zod';
import { FocusElType } from '../../flow-data';
import { FlowHandler } from '../../utils/handler.util';
import {
   DragToType,
   DragToElType,
   DragElToElType,
   DragElToType,
   TriggerFlowData,
} from '../../flow-data/actions/trigger-flow-data.schema';
import {
   BlurElType,
   InputElType,
} from '../../flow-data/actions/trigger-flow-data.schema';
import { getElementOrThrow } from '../../utils/check.util';

/**
 * 处理鼠标移动事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const focusElHandler: FlowHandler<FocusElType> = async ({
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
   await element.focus();
   return {
      message: `元素 ${selector} 获得焦点::ok`,
      status: 'success',
   };
};

/**
 * 处理鼠标失焦事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const blurElHandler: FlowHandler<BlurElType> = async ({
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
   await page.evaluate((el) => {
      el.blur();
   }, element);
   return {
      message: `元素 ${selector} 失去焦点::ok`,
      status: 'success',
   };
};

/**
 * 处理输入事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const inputElHandler: FlowHandler<InputElType> = async ({
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
   const [selector, text] = z.tuple([z.string(), z.string()]).parse(params);
   const element = await getElementOrThrow(page, selector);
   await element.fill(text);
   return {
      message: `输入 ${text} 到元素 ${selector}::ok`,
      status: 'success',
   };
};

/**
 * 处理拖拽事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const dragToHandler: FlowHandler<DragToType> = async ({
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
   const [startX, startY, endX, endY] = z
      .tuple([z.number(), z.number(), z.number(), z.number()])
      .parse(params);
   await page.mouse.move(startX, startY);
   await page.mouse.down();
   await page.mouse.move(endX, endY);
   await page.mouse.up();
   return {
      message: `拖拽鼠标从(${startX}, ${startY})到(${endX}, ${endY})::ok`,
      status: 'success',
   };
};

/**
 * 处理拖拽到元素事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const dragToElHandler: FlowHandler<DragToElType> = async ({
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
   const [startX, startY, selector] = z
      .tuple([z.number(), z.number(), z.string()])
      .parse(params);
   const element = await getElementOrThrow(page, selector);
   const box = await element.boundingBox();
   if (!box) {
      throw new Error(`元素不可见: ${selector}`);
   }
   const targetX = box.x + box.width / 2;
   const targetY = box.y + box.height / 2;
   await page.mouse.move(startX, startY);
   await page.mouse.down();
   await page.mouse.move(targetX, targetY);
   await page.mouse.up();
   return {
      message: `拖拽鼠标从(${startX}, ${startY})到元素(${selector})的中心坐标(${targetX}, ${targetY})::ok`,
      status: 'success',
   };
};

/**
 * 处理拖拽元素到指定位置事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const dragElToHandler: FlowHandler<DragElToType> = async ({
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
   const [selector, endX, endY] = z
      .tuple([z.string(), z.number(), z.number()])
      .parse(params);
   const element = await getElementOrThrow(page, selector);
   await page.mouse.move(endX, endY);
   await element.hover();
   await page.mouse.down();
   await page.mouse.up();
   return {
      message: `拖拽元素 ${selector} 到指定位置(${endX}, ${endY})::ok`,
      status: 'success',
   };
};

/**
 * 处理拖拽元素到指定元素事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const dragElToElHandler: FlowHandler<DragElToElType> = async ({
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
   const [selector, targetSelector] = z
      .tuple([z.string(), z.string()])
      .parse(params);
   const element = await getElementOrThrow(page, selector);
   const targetElement = await getElementOrThrow(page, targetSelector);
   const box = await targetElement.boundingBox();
   if (!box) {
      throw new Error(`元素不可见: ${targetSelector}`);
   }
   await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
   await element.hover();
   await page.mouse.down();
   await page.mouse.up();
   return {
      message: `拖拽元素 ${selector} 到元素 ${targetSelector}::ok`,
      status: 'success',
   };
};

/**
 * 处理触发事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
export const handlerTriggerFlowData: FlowHandler<TriggerFlowData> = async (
   options
) => {
   const { action } = options.data;
   switch (action) {
      case 'focus-el':
         return await focusElHandler(options as any);
      case 'blur-el':
         return await blurElHandler(options as any);
      case 'input-el':
         return await inputElHandler(options as any);
      case 'drag-to':
         return await dragToHandler(options as any);
      case 'drag-to-el':
         return await dragToElHandler(options as any);
      case 'drag-el-to':
         return await dragElToHandler(options as any);
      case 'drag-el-to-el':
         return await dragElToElHandler(options as any);
      default:
         throw new Error(`不支持的 action: ${action}`);
   }
};
