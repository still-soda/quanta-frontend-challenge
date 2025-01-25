/// 该文件中定义了用来比较两个值是否符合某种关系的工具函数
/// 例如：是否相等、是否大于、是否包含等
/// @athor: still-soda
/// @date: 2024.01.13

export type Operator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'contains'
  | 'notContains'
  | 'match';

/**
 * 这个类型是用来存储比较的参数的。
 * - `actual`: 实际值
 * - `expected`: 期望值
 * - `type`: 类型
 * - `key?`: 键（缺省的情况下，生成的比较信息将为按照文本比较形式）
 * - `selector`: 选择器
 * - `operator`: 操作符
 */
export type CompareValueOptions = {
  actual: any;
  expected: any;
  type: string;
  key?: string;
  selector: string;
  operator: Operator;
};

/**
 * 这个函数是用来生成比较的字符串的，会被 compareValue 函数调用，
 * 生成结果将被嵌入到生成的提示信息中。
 * @param operator 操作符
 */
function getRelationStr(operator: Operator) {
  if (operator === 'eq') return '为';
  if (operator === 'ne') return '不为';
  if (operator === 'gt') return '大于';
  if (operator === 'lt') return '小于';
  if (operator === 'gte') return '大于等于';
  if (operator === 'lte') return '小于等于';
  if (operator === 'contains') return '包含';
  if (operator === 'notContains') return '不包含';
  if (operator === 'match') return '匹配';
  return '';
}

/**
 * 这个函数是用来生成比较的提示信息的，会被 compareValue 函数调用。
 */
function getMsgFn(options: CompareValueOptions) {
  const { key, selector, type, operator, expected, actual } = options;
  const getFailedMsg = (relationStr: string) => {
    return key
      ? `期望选择器 ${selector} 的${type} ${key} ${relationStr} ${expected}，实际值为 ${actual}`
      : `期望选择器 ${selector} 的${type}${relationStr} ${expected}，实际值为 ${actual}`;
  };
  return (ok: boolean) => {
    const relationStr = getRelationStr(operator);
    return ok ? 'ok' : getFailedMsg(relationStr);
  };
}

/**
 * 这个对象是用来存储比较函数的，会被 compareValue 函数调用。
 * > 比较函数的参数是两个值，返回值是一个布尔值。
 */
const compareFn: Record<Operator, (a: any, b: any) => boolean> = {
  eq: (a: any, b: any) => a === b,
  ne: (a: any, b: any) => a !== b,
  gt: (a: any, b: any) => a > b,
  lt: (a: any, b: any) => a < b,
  gte: (a: any, b: any) => a >= b,
  lte: (a: any, b: any) => a <= b,
  contains: (a: string, b: string) => a.includes(b),
  notContains: (a: string, b: string) => !a.includes(b),
  match: (a: any, b: any) => new RegExp(b).test(a),
};

/**
 * 这个函数是用来比较两个值是否符合某种关系的。
 * @retrun
 * 返回一个对象，包含了比较的提示信息和比较的结果。
 * - `msg`: 比较的提示信息（比较成功的情况下始终为`ok`）；信息格式受到 `options` 中
 *          `key` 参数的影响，如果 `key` 存在，则信息中会包含 `key`；
 * - `val`: 比较的结果
 */
export function compareValue(options: CompareValueOptions) {
  if (!compareFn[options.operator]) {
    return {
      msg: '未知操作符 unknown',
      val: false,
    };
  }

  const { actual, expected, operator } = options;
  const msgFn = getMsgFn(options);

  const strRequiredOperators = ['contains', 'notContains'];
  if (strRequiredOperators.includes(operator) && typeof actual !== 'string') {
    return { msg: '实际值不是字符串', val: false };
  }

  const ok = compareFn[operator](actual, expected);
  return { msg: msgFn(ok), val: ok };
}
