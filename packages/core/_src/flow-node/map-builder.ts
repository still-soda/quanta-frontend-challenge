import { FlowNode, IFlowData } from '.';

/**
 * 使用点分隔的键从对象中循环获取值
 * @param obj 对象，可以是普通对象或 Map 对象
 * @param key 点分隔的键
 * @returns 值
 * @example
 * ```ts
 * const obj = { a: { b: { c: 1 } } };
 * const value = getValue(obj, 'a.b.c'); // 1
 * ```
 * @example
 * ```ts
 * const obj = new Map([['a', new Map([['b', new Map([['c', 1]])]])]]);
 * const value = getValue(obj, 'a.b.c'); // 1
 * ```
 */
function getValue(obj: any, key: string) {
   if (!obj || key === '') return obj;
   const [first, ...rest] = key.split('.');
   return getValue(
      obj instanceof Map ? obj.get(first) : obj[first],
      rest.join('.')
   );
}

/**
 * 构建流程节点图
 * @param data 流程数据
 * @returns 流程节点图
 * @example
 * ```ts
 * const data = [
 *    { action: 'click', output: 'a', deps: [] },
 *    { action: 'input', output: 'b', deps: ['a'] },
 * ];
 * const map = buildMap(data);
 * ```
 */
export function buildMap<ENV extends Record<string, any>>(
   data: IFlowData<ENV>[]
): FlowNode<ENV> {
   const nodeMap = new Map<string, FlowNode<ENV>>();
   for (const item of data) {
      const node = new FlowNode<ENV>(item.runTask, item.output, item.deps);
      nodeMap.set(item.output, node);

      node.deps.forEach((dep) => {
         const depNode: FlowNode<ENV> = getValue(nodeMap, dep);
         if (depNode) {
            depNode.addNext(node);
         }
      });
   }

   const startNode = nodeMap.get('$0');
   if (!startNode) {
      throw new Error('Start node not found');
   }

   return startNode;
}
