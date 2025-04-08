import { z } from 'zod';
import {
   GetElAttrType,
   GetElStyleType,
   GetElTextType,
   ValueGetterFlowData,
} from '../../flow-data';
import { getElementOrThrow } from '../../utils/check.util';
import { FlowHandler } from '../../utils/handler.util';

/**
 * 获取元素文本内容
 */
const getElTextHandler: FlowHandler<GetElTextType> = async ({
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
   return {
      message: `获取元素 ${selector} 的文本内容::ok`,
      status: 'success',
      value: await element.evaluate((el) => el.textContent),
   };
};

/**
 * 获取元素属性
 */
const getElAttrHandler: FlowHandler<GetElAttrType> = async ({
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
   const [selector, attr] = z.tuple([z.string(), z.string()]).parse(params);
   const element = await getElementOrThrow(page, selector);
   return {
      message: `获取元素 ${selector} 的属性 ${attr}::ok`,
      status: 'success',
      value: await element.evaluate(
         (el, attr: any) => el.getAttribute(attr),
         attr
      ),
   };
};

/**
 * 获取元素样式
 */
const getElStyleHandler: FlowHandler<GetElStyleType> = async ({
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
   const [selector, style] = z.tuple([z.string(), z.string()]).parse(params);
   const element = await getElementOrThrow(page, selector);
   return {
      message: `获取元素 ${selector} 的样式 ${style}::ok`,
      status: 'success',
      value: await element.evaluate(
         (el, style: any) => getComputedStyle(el)[style],
         style
      ),
   };
};

/**
 * 获取元素中心坐标
 */
const getElCenterPosSchema: FlowHandler<GetElAttrType> = async ({
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
   const { x, y, width, height } = box;

   return {
      message: `获取元素 ${selector} 的中心坐标::ok`,
      status: 'success',
      value: {
         x: x + width / 2,
         y: y + height / 2,
      },
   };
};

/**
 * 处理获取值的事件
 * @param options
 * - `page`: 页面对象
 * - `data`: 流程数据
 * - `data.deps`: 依赖数据
 * - `depsMap`: 依赖映射表
 */
export const handleValueGetterFlowData: FlowHandler<
   ValueGetterFlowData
> = async (options) => {
   const { action } = options.data;
   switch (action) {
      case 'get-el-text':
         return getElTextHandler(options as any);
      case 'get-el-attr':
         return getElAttrHandler(options as any);
      case 'get-el-style':
         return getElStyleHandler(options as any);
      case 'get-el-center-pos':
         return getElCenterPosSchema(options as any);
      default:
         throw new Error(`不支持的操作: ${action}`);
   }
};
