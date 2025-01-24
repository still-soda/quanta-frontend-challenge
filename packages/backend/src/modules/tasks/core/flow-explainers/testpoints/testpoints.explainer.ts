import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
} from '../../flow-data';

export function explainExpectTestpointAction(
  detail: ExpectTestpointFlowData['detail'],
) {
  let suffix = '';
  if (detail.typeParser) {
    suffix = `(类型转换：${detail.typeParser})`;
  }

  const prefix = `[${detail.name}: ${detail.score}分]:`;

  let relSymbol = '等于';
  if (detail.compare === 'ne') {
    relSymbol = '不等于';
  } else if (detail.compare === 'gt') {
    relSymbol = '大于';
  } else if (detail.compare === 'lt') {
    relSymbol = '小于';
  } else if (detail.compare === 'gte') {
    relSymbol = '大于等于';
  } else if (detail.compare === 'lte') {
    relSymbol = '小于等于';
  }

  if (detail.attr && detail.value) {
    return `${prefix} 期望选择器 ${detail.selector} 的属性 ${detail.attr} ${
      relSymbol
    } ${detail.value} ${suffix}`;
  }

  if (detail.text) {
    return `${prefix} 期望选择器 ${detail.selector} 的文本${relSymbol} ${
      detail.text
    } ${suffix}`;
  }

  if (detail.exist !== undefined) {
    return `${prefix} 期望选择器 ${detail.selector} ${
      detail.exist ? '存在' : '不存在'
    } ${suffix}`;
  }

  return `${prefix} 未知期望测试点`;
}

export function explainScreenShotTestpointAction(
  detail: ScreenShotTestpointFlowData['detail'],
) {
  return `[${detail.name}: ${detail.score}分]: 截图选择器 ${detail.root} 进行比对`;
}

export function explainScreenShotTestpointPreAction(
  detail: ScreenShotTestpointFlowData['detail'],
) {
  return `[${detail.name}: ${detail.score}分]: 生成选择器 ${detail.root} 的截图`;
}
