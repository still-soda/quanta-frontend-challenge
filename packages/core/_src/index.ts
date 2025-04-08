import { Page } from 'playwright';
import { FlowData } from './flow-data/flow-data.schema';
import { BasicEnvironment, handleOneFlowData } from './flow-handler';
import { buildMap, IFlowData } from './flow-node';

/**
 * 运行流程数据
 *
 * 函数将首先解析流程数据并构建一张流程图，然后运行起始节点。
 *
 * 接着，它会计算所有依赖项的状态和分数，并生成执行结果。
 *
 * 最后，函数返回一个对象，其中包含是否通过、总分、执行结果和生成的截图。
 *
 * @param flowdatas - 流程数据数组
 * @param env - 环境对象
 * @returns 一个对象，包含以下属性：
 * - `passed`: 布尔值，表示是否通过
 * - `totalScore`: 数字，总分
 * - `result`: 数组，包含每个节点的执行结果
 * - `generateImgBuffer`: 数组，包含生成的截图
 */
export async function run<ENV extends BasicEnvironment>(
   flowdatas: FlowData[],
   env: ENV,
   page: Page
) {
   // TODO: 解析流程数据
   const data: any = /* TODO */ null;
   const startNode = buildMap(data);
   await startNode.run(env);

   const { depsStore } = startNode;
   const valueList = Array.from(depsStore.values());

   // 计算是否通过
   const passed = valueList.every(({ status }) => status === 'success');
   // 计算总分
   const totalScore = valueList.reduce(
      (total, { score }) => total + (score ?? 0),
      0
   );
   // 获取生成的截图
   const generateImgBuffer = valueList
      .filter((item: any) => !item.__ignore__ && item.value instanceof Buffer)
      .map((item) => item.value);
   // 获取执行数据
   const result = valueList.map((item) => ({
      message: item.message,
      score: item.score || 0,
      success: item.status === 'success',
   }));

   return {
      passed,
      totalScore,
      result,
      generateImgBuffer,
   };
}
