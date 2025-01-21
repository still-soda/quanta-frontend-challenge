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

export async function ensureSelectorExists(page: Page, selector: string) {
  const el = page.locator(selector);
  if ((await el.count()) === 0) {
    throw new Error(`选择器 ${selector} 不存在`);
  }
}

export async function handleMouseAction(options: {
  page: Page;
  detail: MouseActionsDetail;
}) {
  const { page, detail } = options;

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
      return;
    }

    if (detail.selector) {
      await ensureSelectorExists(page, detail.selector);
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

export async function handleTriggerAction(options: {
  page: Page;
  detail: TriggerActionsDetail;
}) {
  const { page, detail } = options;

  if (detail.type === 'hover') {
    await ensureSelectorExists(page, detail.selector);
    await page.hover(detail.selector);
    return;
  }

  if (detail.type === 'focus') {
    await ensureSelectorExists(page, detail.selector);
    await page.focus(detail.selector);
    return;
  }

  if (detail.type === 'blur') {
    await ensureSelectorExists(page, detail.selector);
    await page.$eval(detail.selector, (el: any) => el.blur());
    return;
  }

  if (detail.type === 'drag') {
    await ensureSelectorExists(page, detail.from);
    await ensureSelectorExists(page, detail.to);
    await page.dragAndDrop(detail.from, detail.to);
    return;
  }

  if (detail.type === 'input') {
    await ensureSelectorExists(page, detail.selector);
    await page.fill(detail.selector, detail.value);
    return;
  }

  if (detail.type === 'wait') {
    await page.waitForTimeout(detail.time);
    return;
  }

  throw new Error('未知的触发事件');
}
