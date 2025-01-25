export class DataType<Type extends string, Value> {
   type: Type;
   value: Value;
   isOptional: boolean = false;

   constructor(type: Type, content: Value) {
      this.type = type;
      this.value = content;
   }

   /**
    * 让当前数据类型成为可选值
    */
   optional() {
      this.isOptional = true;
      return this;
   }
}

function d<T extends string, V>(type: T, content: V): DataType<T, V> {
   return new DataType(type, content);
}

export function $string(): DataType<'basic', 'string'> {
   return d('basic', 'string');
}

export function $number(): DataType<'basic', 'number'> {
   return d('basic', 'number');
}

export function $object(): DataType<'basic', 'object'>;

export function $object(
   content: Record<string, DataType<any, any>>
): DataType<'object', Record<string, DataType<any, any>>>;

export function $object(
   content?: Record<string, DataType<any, any>>
):
   | DataType<'basic', 'object'>
   | DataType<'object', Record<string, DataType<any, any>>> {
   return content
      ? d('object', content)
      : d<'basic', 'object'>('basic', 'object');
}

export function $array<T extends string, K>(
   ...contents: DataType<T, K>[]
): DataType<'array', DataType<T, K>[]> {
   return d('array', contents);
}

export function $function(): DataType<'basic', 'function'> {
   return d('basic', 'function');
}

export function $bigint(): DataType<'basic', 'bigint'> {
   return d('basic', 'bigint');
}

export function $symbol(): DataType<'basic', 'symbol'> {
   return d('basic', 'symbol');
}

export function $boolean(): DataType<'basic', 'boolean'> {
   return d('basic', 'boolean');
}

export function $undefined(): DataType<'basic', 'undefined'> {
   return d('basic', 'undefined');
}

export function $value<T>(val: T): DataType<'value', T> {
   return d('value', val);
}

export function $fn(
   fn: (val: string) => boolean
): DataType<'function', (val: string) => boolean> {
   return d('function', fn);
}

export function $any(): ReturnType<typeof $fn> {
   return d('function', () => true);
}

export function $enum<T>(...args: T[]): DataType<'enum', T[]> {
   return d('enum', args);
}

export function $record<
   K extends DataType<any, any>,
   V extends DataType<any, any>,
>(key: K, value: V): DataType<'record', [K, V]> {
   return d('record', [key, value]);
}

export type availableTypes =
   | ReturnType<typeof $number>
   | ReturnType<typeof $string>
   | ReturnType<typeof $object>
   | ReturnType<typeof $function>
   | ReturnType<typeof $bigint>
   | ReturnType<typeof $symbol>
   | ReturnType<typeof $boolean>
   | ReturnType<typeof $undefined>
   | ReturnType<typeof $value>
   | ReturnType<typeof $fn>
   | ReturnType<typeof $enum>
   | ReturnType<typeof $record>
   | ReturnType<typeof $array>
   | ReturnType<typeof $any>
   | DataType<'basic', 'object'>;
