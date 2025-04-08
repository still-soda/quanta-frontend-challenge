import { FlowHandler } from '../../utils/handler.util';
import {
   ClickAtType,
   ClickElType,
   MouseFlowData,
   MoveToElType,
   MoveToType,
   ScrollType,
} from '../../flow-data';
import { z } from 'zod';
import { getElementOrThrow } from '../../utils/check.util';

/**
 * 处理鼠标移动事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const mouseToHandler: FlowHandler<MoveToType> = async ({
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
   const [x, y] = z.tuple([z.number(), z.number()]).parse(params);
   await page.mouse.move(x, y);
   return {
      message: `鼠标移动到指定坐标(${x}, ${y})::ok`,
      status: 'success',
   };
};

/**
 * 处理鼠标移动到元素事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const mouseToElHandler: FlowHandler<MoveToElType> = async ({
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
   const box = await element.boundingBox();
   if (!box) {
      throw new Error(`指定元素不可见: ${selector}`);
   }
   const x = box.x + box.width / 2;
   const y = box.y + box.height / 2;
   await page.mouse.move(x, y);
   return {
      message: `鼠标移动到元素(${selector})的中心坐标(${x}, ${y})::ok`,
      status: 'success',
   };
};

/**
 * 处理点击事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const clickHandler: FlowHandler<ClickAtType> = async ({
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
   const [button, count, x, y] = z
      .tuple([
         z.enum(['left', 'right', 'middle']),
         z.number(),
         z.number(),
         z.number(),
      ])
      .parse(params);
   await page.mouse.click(x, y, { button, clickCount: count });
   return {
      message: `${button}键点击坐标(${x}, ${y}) ${count}次::ok`,
      status: 'success',
   };
};

/**
 * 处理点击元素事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const clickElHandler: FlowHandler<ClickElType> = async ({
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
   const [button, count, selector] = z
      .tuple([z.enum(['left', 'right', 'middle']), z.number(), z.string()])
      .parse(params);
   const element = await getElementOrThrow(page, selector);
   await element.click({ button, clickCount: count });
   return {
      message: `${button}键点击元素(${selector}) ${count}次::ok`,
      status: 'success',
   };
};

/**
 * 处理滚动事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
const scrollHandler: FlowHandler<ScrollType> = async ({
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
   const [deltaX, deltaY] = z.tuple([z.number(), z.number()]).parse(params);
   await page.mouse.wheel(deltaX, deltaY);
   return {
      message: `鼠标滚轮滚动(${deltaX}, ${deltaY})::ok`,
      status: 'success',
   };
};

/**
 * 处理鼠标事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
export const handleMouseFlowData: FlowHandler<MouseFlowData> = (options) => {
   const { action } = options.data;
   switch (action) {
      case 'move-to':
         return mouseToHandler(options as any);
      case 'move-to-el':
         return mouseToElHandler(options as any);
      case 'click-at':
         return clickHandler(options as any);
      case 'click-el':
         return clickElHandler(options as any);
      case 'scroll':
         return scrollHandler(options as any);
      default:
         throw new Error(`不支持的 action: ${action}`);
   }
};
