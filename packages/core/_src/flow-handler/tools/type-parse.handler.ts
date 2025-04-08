import { z } from 'zod';
import { TypeParseType } from '../../flow-data';
import { FlowHandler } from '../../utils/handler.util';

/**
 * 将值转换为指定类型，可选类型有：string、number、boolean
 */
export const handleTypeParseFlowData: FlowHandler<TypeParseType> = async ({
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
   const [originValue, type] = z
      .tuple([z.any(), z.enum(['string', 'number', 'boolean'])])
      .parse(params);

   let parsedValue: any;
   switch (type) {
      case 'string':
         parsedValue = String(originValue);
         break;
      case 'number':
         parsedValue = Number(originValue);
         break;
      case 'boolean':
         parsedValue = Boolean(originValue);
         break;
      default:
         throw new Error(`Unsupported type: ${type}`);
   }

   return {
      message: `将值 ${originValue} 转换为 ${type} 类型;ok`,
      status: 'success',
      value: parsedValue,
   };
};
