import { AllFlowData } from '../flow-data/index';
import {
  explainMouseAciton,
  explainTriggerAction,
} from './actions/actions.explainer';
import {
  explainExpectTestpointAction,
  explainScreenShotTestpointAction,
  explainScreenShotTestpointPreAction,
} from './testpoints/testpoints.explainer';

/**
 * 解释一条流程数据，返回解释结果。如果无法解释，返回 '未知流程数据'。
 * @param flowdata 流程数据
 * @param isPre 是否是预执行
 * @returns 解释结果字符串
 */
export function explainOneFlowData(
  flowdata: AllFlowData,
  isPre: boolean = false,
) {
  if (flowdata.type === 'mouse') {
    return explainMouseAciton(flowdata.detail);
  }

  if (flowdata.type === 'trigger') {
    return explainTriggerAction(flowdata.detail);
  }

  if (flowdata.type === 'testpoint') {
    if (flowdata.detail.type === 'expect') {
      return explainExpectTestpointAction(flowdata.detail);
    }

    if (flowdata.detail.type === 'screenshot') {
      return isPre
        ? explainScreenShotTestpointPreAction(flowdata.detail)
        : explainScreenShotTestpointAction(flowdata.detail);
    }
  }

  return '未知流程数据';
}
