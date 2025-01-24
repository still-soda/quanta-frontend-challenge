import {
  MouseActionsDetail,
  TriggerActionsDetail,
} from '../../flow-handlers/actions/actions.handler';

/**
 * 解释鼠标事件，返回一个可读的字符串。如果无法解释，则返回 “未知鼠标事件”
 * @param detail `MouseFlowData` -> `detail`
 * @returns 解释字符串
 */
export function explainMouseAciton(detail: MouseActionsDetail): string {
  if (detail.type === 'click') {
    if (detail.selector) {
      return `点击选择器 ${detail.selector}`;
    } else {
      const { x, y } = detail;
      return `点击坐标 (${x}, ${y})`;
    }
  }

  if (detail.type === 'move') {
    if (detail.selector) {
      return `移动到选择器 ${detail.selector}`;
    } else {
      const { x, y } = detail;
      return `移动到坐标 (${x}, ${y})`;
    }
  }

  if (detail.type === 'dbclick') {
    if (detail.selector) {
      return `双击选择器 ${detail.selector}`;
    } else {
      const { x, y } = detail;
      return `双击坐标 (${x}, ${y})`;
    }
  }

  if (detail.type === 'scroll') {
    const { x, y } = detail;
    return `水平滚动 ${x}px，垂直滚动 ${y}px`;
  }

  return '未知鼠标事件';
}

/**
 * 解释触发事件，返回一个可读的字符串。如果无法解释，则返回 “未知触发事件”
 * @param detail `TriggerFlowData` -> `detail`
 * @returns 解释字符串
 */
export function explainTriggerAction(detail: TriggerActionsDetail): string {
  if (detail.type === 'blur') {
    const { selector } = detail;
    return `失去选择器 ${selector} 的焦点`;
  }

  if (detail.type === 'drag') {
    const { from, to } = detail;
    return `拖动选择器 ${from} 到选择器 ${to}`;
  }

  if (detail.type === 'focus') {
    const { selector } = detail;
    return `聚焦选择器 ${selector}`;
  }

  if (detail.type === 'hover') {
    const { selector } = detail;
    return `悬停在选择器 ${selector} 上`;
  }

  if (detail.type === 'input') {
    const { selector, value } = detail;
    return `在选择器 ${selector} 输入文本：${value}`;
  }

  if (detail.type === 'wait') {
    const { time } = detail;
    return `等待 ${time} 毫秒`;
  }

  return '未知触发事件';
}
