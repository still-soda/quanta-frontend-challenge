import { Result } from '../utils/handler.util';

/**
 * 流程节点类
 *
 * 该类用于表示一个流程节点，包含节点的 action、输出、依赖项等信息
 * 以及节点之间的关系
 *
 * @template `ENV` - 环境变量类型
 * @property `action` - 节点的动作
 * @property `output` - 节点的输出
 * @property `deps` - 节点的依赖项
 * @property `store` - 节点的存储
 * @property `next` - 节点的下游节点
 * @property `depsStore` - 节点的依赖项存储
 */
export class FlowNode<ENV extends Record<string, any>> {
   // store 用于存储树中每个节点产生的数据
   private store: Map<string, Result> | null = null;
   // deps 用于存储当前节点的下游节点
   private next: Set<FlowNode<ENV>> = new Set();

   constructor(
      public runTask: (env: ENV, ...args: any[]) => Promise<any>,
      public output: string,
      public deps: string[]
   ) {}

   get depsStore() {
      return this.store ?? new Map<string, Result>();
   }

   addNext(node: FlowNode<ENV>) {
      this.next.add(node);
   }

   hasReady(deps: Map<string, any>) {
      // 检查当前节点是否都已准备好的方法是：
      // 检查 deps 中是否存在当前节点的所有依赖项
      return this.deps.every((dep) => deps.has(dep));
   }

   async run(env: ENV, deps: Map<string, any> = new Map()) {
      const toRun = async () => {
         this.store = deps;
         const args = this.deps.map((dep) => deps.get(dep)?.value);
         // 执行当前节点的 action，并将结果存储到 deps 中
         const result = await this.runTask(env, ...args);
         deps.set(this.output, result);
         // 并行执行下游节点
         const promises: Promise<any>[] = [];
         this.next.forEach(async (node) => {
            if (node.hasReady(deps)) {
               promises.push(node.run(env, deps));
            }
         });
         await Promise.all(promises);
      };
      // 处理异常，绑定位置到错误对象
      return await toRun().catch((err) => {
         err.location ??= this.output;
         !deps.has(this.output) &&
            deps.set(this.output, {
               status: 'failure',
               value: err.message,
            });
         throw err;
      });
   }
}
