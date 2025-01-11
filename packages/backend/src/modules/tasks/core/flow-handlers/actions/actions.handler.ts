import { Page } from 'playwright';
import {
  BlurTriggerFlowData,
  ClickMouseFlowData,
  DragTriggerFlowData,
  FocusTriggerFlowData,
  HoverTriggerFlowData,
  MoveMouseFlowData,
  ScrollMouseFlowData,
  InputTriggerFlowData,
  WaitTriggerFlowData,
} from '../../flow-data';

export type MouseActionsDetail =
  | ClickMouseFlowData['detail']
  | MoveMouseFlowData['detail']
  | ScrollMouseFlowData['detail'];

export type TriggerActionsDetail =
  | HoverTriggerFlowData['detail']
  | BlurTriggerFlowData['detail']
  | FocusTriggerFlowData['detail']
  | DragTriggerFlowData['detail']
  | InputTriggerFlowData['detail']
  | WaitTriggerFlowData['detail'];

const click = async (
  page: Page,
  button: 'left' | 'right' | 'middle' = 'left',
  count = 1,
) => {
  page.mouse.down({ button });
  page.mouse.up({ button });
  count > 1 && (await click(page, button, count - 1));
};

export async function handleMouseActions(
  page: Page,
  detail: MouseActionsDetail,
) {
  // 移动
  if (detail.type === 'move') {
    await page.mouse.move(detail.x ?? 0, detail.y ?? 0);
    return;
  }

  // 点击
  if (detail.type === 'click' || detail.type === 'dbclick') {
    const isDbClick = detail.type === 'dbclick';
    if (detail.x || detail.y) {
      await page.mouse.move(detail.x, detail.y);
      await click(page, detail.button, isDbClick ? 2 : 1);
    } else if (detail.selector) {
      const options = { button: detail.button };
      await page.click(detail.selector, options);
      isDbClick && (await page.click(detail.selector, options));
    }
    return;
  }

  // 滚动
  if (detail.type === 'scroll') {
    await page.mouse.wheel(detail.x ?? 0, detail.y ?? 0);
    return;
  }

  throw new Error('未知的鼠标事件');
}

export async function handleTriggerAction(
  page: Page,
  detail: TriggerActionsDetail,
) {
  if (detail.type === 'hover') {
    await page.hover(detail.selector);
    return;
  }

  if (detail.type === 'focus') {
    await page.focus(detail.selector);
    return;
  }

  if (detail.type === 'blur') {
    await page.$eval(detail.selector, (el: any) => el.blur());
    return;
  }

  if (detail.type === 'drag') {
    await page.dragAndDrop(detail.from, detail.to);
    return;
  }

  if (detail.type === 'input') {
    await page.fill(detail.selector, detail.value);
    return;
  }

  if (detail.type === 'wait') {
    await page.waitForTimeout(detail.time);
    return;
  }

  throw new Error('未知的触发事件');
}
