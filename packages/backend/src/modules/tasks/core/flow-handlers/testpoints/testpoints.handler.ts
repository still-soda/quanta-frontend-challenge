import { Page } from 'playwright';
import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
} from '../../flow-data';
import { AssetsService } from 'src/modules/assets/assets.service';
import { compareValue } from '../../utils/compare.util';

interface TestpointActionResult {
  msg: string;
  score: number;
}

interface TestpointPreActionResult {
  msg: string;
  testImageName?: string;
  score: number;
}

/**
 * 将字符串数组转换为指定类型的数组。
 *
 * 这个函数在转化为 boolean 类型时，会将其转化为 `true` 或 `false` 的字符串，
 * 而不是布尔值。
 *
 * @param values 字符串数组
 * @param parseTarget 转换目标类型
 * - `text`: 文本
 * - `number`: 数字
 * - `boolean`: 布尔值
 * @returns 转换后的数组
 */
function typeParse<T extends string | number>(
  values: string[],
  parseTarget: 'text' | 'number' | 'boolean',
) {
  const result: T[] = [];
  for (const value of values) {
    if (parseTarget === 'number') {
      result.push(Number(value) as T);
    } else if (parseTarget === 'boolean') {
      if (value === 'true' || value === 'false') {
        result.push(value as T);
        continue;
      }
      result.push((!!value ? 'true' : 'false') as T);
    } else {
      result.push(value as T);
    }
  }
  return result;
}

/**
 * 处理期望测试点
 * @param options
 * - `page`: 页面
 * - `detail`: 流程数据
 * @returns 测试点结果
 */
export async function handleExpectTestpointAction(options: {
  page: Page;
  detail: ExpectTestpointFlowData['detail'];
}): Promise<TestpointActionResult> {
  const { page, detail } = options;

  // 存在性判断
  if (detail.exist !== undefined) {
    const exist = !!(await page.$(detail.selector));
    if (exist !== detail.exist) {
      return {
        msg: `期望选择器 ${detail.selector} ${detail.exist ? '存在' : '不存在'}，但实际${exist ? '存在' : '不存在'}`,
        score: 0,
      };
    }
    return { msg: 'ok', score: detail.score };
  }

  if (detail.text !== undefined) {
    const selector = detail.selector;
    const element = await page.$(selector);
    if (!element) {
      return {
        msg: `期望选择器 ${selector} 存在，实际值不存在`,
        score: 0,
      };
    }

    const operator = detail.compare ?? 'eq';
    let text: string;
    let key: string | undefined;
    let type: string;

    if (detail.attr) {
      text = await element.getAttribute(detail.attr);
      key = detail.attr;
      type = '属性';
    } else {
      text = await element.innerText();
      type = '文本';
    }

    const [expected, actual] = typeParse(
      [detail.text, text],
      detail.typeParser ?? 'text',
    );
    const cmpResult = compareValue({
      expected,
      actual,
      key,
      selector,
      operator,
      type,
    });

    const msgSuffix =
      detail.typeParser && !cmpResult.val
        ? `（use ${detail.typeParser} parser）`
        : '';

    return {
      msg: cmpResult.msg + msgSuffix,
      score: +cmpResult.val * detail.score,
    };
  }

  return { msg: '', score: 0 };
}

/** @todo */
export async function handleScreenShotTestpointPreAction(options: {
  page: Page;
  detail: ScreenShotTestpointFlowData['detail'];
  assetsService: AssetsService;
}): Promise<TestpointPreActionResult> {
  const { page, detail, assetsService } = options;
  return { msg: '', testImageName: '', score: 0 };
}

/** @todo */
export async function handleScreenShotTestpointAction(options: {
  page: Page;
  detail: ScreenShotTestpointFlowData['detail'];
  testImageName: string;
  assetsService: AssetsService;
}): Promise<TestpointActionResult> {
  const { page, detail, testImageName, assetsService } = options;
  return { msg: '', score: 0 };
}
