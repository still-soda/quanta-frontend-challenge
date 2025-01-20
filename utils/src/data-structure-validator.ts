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

const BASIC_TYPES = [
   'string',
   'object',
   'number',
   'function',
   'bigint',
   'symbol',
   'boolean',
   'undefined',
] as const;
const BASIC_TYPES_SET = new Set(BASIC_TYPES);

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

export function fit(
   obj: Record<string, any>,
   dataStructure: Record<string, typeof BASIC_TYPES | any>,
   shouldThrow = false
): { msg: string; ok: boolean } {
   const entries = Object.entries(dataStructure);
   let result = { msg: 'ok', ok: true };
   let catched = false;

   for (let [key, val] of entries) {
      let optional = false;
      if (val.__optional__) {
         optional = true;
         val = val.value;
      }
      if (val !== 'undefined' && obj[key] === undefined) {
         if (optional) continue;
         result = { msg: `不存在 ${key}`, ok: false };
         catched = true;
         break;
      } else if (BASIC_TYPES_SET.has(val)) {
         if (typeof obj[key] !== val) {
            result = { msg: `${key} 类型错误`, ok: false };
            catched = true;
            break;
         }
      } else if (typeof val === 'function') {
         if (!val(obj[key])) {
            result = { msg: `对于 ${key} 的函数验证不通过`, ok: false };
            catched = true;
            break;
         }
      } else if (Array.isArray(val)) {
         if (!val.includes(obj[key])) {
            result = {
               msg: `k[${key}]:v[${obj[key]}] 不在可行列表中, li[${val}]`,
               ok: false,
            };
            catched = true;
            break;
         }
      } else if (typeof val === 'string') {
         if (obj[key] !== val) {
            result = {
               msg: `字符串 k[${key}]:v[${obj[key]}] !== ${val}`,
               ok: false,
            };
            catched = true;
            break;
         }
      } else if (typeof val === 'object') {
         const validationResult = fit(obj[key], val);
         if (!validationResult.ok) {
            result = validationResult;
            catched = true;
            break;
         }
      }
   }

   if (catched && shouldThrow) {
      throw new Error(result.msg);
   }
   return result;
}
