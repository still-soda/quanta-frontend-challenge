import { availableTypes } from './data-types';

export function contain<T extends Record<string, any>>(
   obj: T,
   keys: Array<keyof T>
) {
   if (!obj || (obj as any).__checked__) {
      return false;
   }
   (obj as any).__checked__ = true;

   keys.forEach((key) => {
      if (!obj[key]) return false;
   });
   return true;
}

type OptionalValue<T> = {
   __optional__: true;
   value: T;
};

export function Optional<T>(val: T): OptionalValue<T> {
   return {
      __optional__: true,
      value: val,
   };
}

function fitOne(
   key: string,
   val: availableTypes,
   obj: Record<string, any>
): {
   result: { msg: string; ok: boolean };
   catched: boolean;
} {
   let result = { msg: 'ok', ok: true };
   let catched = false;

   if (
      obj[key] === undefined &&
      !(val.value === 'undefined' && val.type === 'basic')
   ) {
      if (val.isOptional) return { result, catched };
      result = { msg: `不存在 ${key}`, ok: false };
      catched = true;
   } else if (val.type === 'basic') {
      if (typeof obj[key] !== val.value) {
         result = {
            msg: `${key} 类型错误，应该为 ${typeof val.value} 实际为 ${obj[key]}`,
            ok: false,
         };
         catched = true;
      }
   } else if (val.type === 'function') {
      if (!val.value(obj[key])) {
         result = { msg: `对于 ${key} 的函数验证不通过`, ok: false };
         catched = true;
      }
   } else if (val.type === 'enum') {
      if (!val.value.includes(obj[key])) {
         result = {
            msg: `k[${key}]:v[${obj[key]}] 不在可行列表中, li[${val.value}]`,
            ok: false,
         };
         catched = true;
      }
   } else if (val.type === 'value') {
      if (obj[key] !== val.value) {
         result = {
            msg: `值 k[${key}]:v[${obj[key]}] !== ${val}`,
            ok: false,
         };
         catched = true;
      }
   } else if (val.type === 'object') {
      const validationResult = fit(obj[key], val.value);
      if (!validationResult.ok) {
         result = validationResult;
         catched = true;
      }
   } else if (val.type === 'array') {
      const { length } = val.value;
      if (!Array.isArray(obj[key])) {
         result = { msg: `k[${key}] 不是数组`, ok: false };
         catched = true;
      }
      if (length > 0) {
         for (let i = 0; i < obj[key].length; i++) {
            let invalid = true;
            let msg = '';
            for (const validator of val.value) {
               const { result: res, catched: c } = fitOne(
                  i.toString(),
                  validator as availableTypes,
                  obj[key]
               );
               if (!c) {
                  invalid = false;
                  break;
               }
               msg = res.msg;
            }
            if (invalid) {
               result = { msg, ok: false };
               break;
            }
         }
      }
   }

   return { result, catched };
}

export function fit(
   obj: Record<string, any>,
   dataStructure: Record<string, availableTypes>,
   shouldThrow = false
): { msg: string; ok: boolean } {
   const entries = Object.entries(dataStructure);
   let result = { msg: 'ok', ok: true };
   let catched = false;

   for (let [key, val] of entries) {
      const { result: res, catched: c } = fitOne(key, val, obj);
      if (c) {
         catched = true;
         result = res;
         break;
      }
   }

   if (catched && shouldThrow) {
      throw new Error(result.msg);
   }
   return result;
}
