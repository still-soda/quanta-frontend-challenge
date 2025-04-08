import { Page } from 'playwright';

/**
 * 获取指定元素，不存在则抛出错误
 * @param page Page 对象
 * @param selector 元素选择器
 * @returns 得到的元素
 * @throws 找不到指定元素，${selector}
 */
export async function getElementOrThrow(page: Page, selector: string) {
   const el = await page.$(selector);
   if (!el) {
      throw new Error(`期望选择器${selector}存在，但不存在`);
   }
   return el;
}
