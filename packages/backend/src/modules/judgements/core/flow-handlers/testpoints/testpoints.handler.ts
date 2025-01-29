/// 这个文件定义了测试点的处理函数，包括期望测试点和截图测试点。
/// @author: still-soda

import { Page } from 'playwright';
import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
} from '../../flow-data';
import { compareValue } from '../../utils/compare.util';
import { Jimp, diff } from 'jimp';

export interface TestpointActionResult {
  msg: string;
  generatedImgBuffer?: Buffer;
  score: number;
}

export interface TestpointPreActionResult {
  msg: string;
  generatedImgBuffer?: Buffer;
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
 * - `msg`: 消息，如果测试对象是样式，则返回多个消息，以 `;;` 分隔
 * - `score`: 分数，如果测试对象是样式，则按照测试通过的样式数的百分比计算分数
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
        msg: `期望选择器 ${detail.selector} ${
          detail.exist ? '存在' : '不存在'
        }，但实际${exist ? '存在' : '不存在'}`,
        score: 0,
      };
    }
    return { msg: 'ok', score: detail.score };
  }

  if (detail.style) {
    const entries = Object.entries(detail.style);
    let result: string[] = [];
    let passCount = 0;
    const element = await page.$(detail.selector);
    if (!element) {
      return {
        msg: `期望选择器 ${detail.selector} 存在，实际值不存在`,
        score: 0,
      };
    }
    for (const [prop, value] of entries) {
      const actual = await element.evaluate(
        (el, prop) => getComputedStyle(el)[prop],
        prop,
      );
      const [expected, actualValue] = typeParse([value.value, actual], 'text');
      const cmpResult = compareValue({
        expected,
        actual: actualValue,
        key: prop,
        selector: detail.selector,
        operator: value.compare,
        type: '样式',
      });
      result.push(cmpResult.msg);
      cmpResult.val && passCount++;
    }
    return {
      msg: result.join(';;'),
      score: (passCount / entries.length) * detail.score,
    };
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

/**
 * 处理截图测试点的前置操作，生成对应根元素的截图并返回
 * @param options
 * - `page`: 页面
 * - `detail`: 流程数据
 * @returns 测试点结果
 * - `msg`: 消息
 * - `generatedImgBuffer`: 生成的图片缓冲区
 * - `score`: 分数
 */
export async function handleScreenShotTestpointPreAction(options: {
  page: Page;
  detail: ScreenShotTestpointFlowData['detail'];
}): Promise<TestpointPreActionResult> {
  const { page, detail } = options;

  const rootElement = await page.$(detail.root);
  if (!rootElement) {
    return {
      msg: `期望选择器 ${detail.root} 存在，实际值不存在`,
      generatedImgBuffer: null,
      score: 0,
    };
  }

  const screenshot = await rootElement.screenshot();

  return {
    msg: 'ok',
    generatedImgBuffer: screenshot,
    score: detail.score,
  };
}

/**
 * 处理截图测试点。将会对比当前页面与预期图片的相似度。
 * @param options
 * - `page`: 页面
 * - `detail`: 流程数据
 * - `testImgBuffer`: 预期图片缓冲区
 * - `threshold`: 相似度阈值
 * @returns 测试点结果
 * - `msg`: 消息
 * - `generatedImgBuffer`: 生成的图片缓冲区
 * - `score`: 分数
 */
export async function handleScreenShotTestpointAction(options: {
  page: Page;
  detail: ScreenShotTestpointFlowData['detail'];
  testImgBuffer: Buffer;
}): Promise<TestpointActionResult> {
  const { page, detail, testImgBuffer } = options;
  const { threshold, root, score } = detail;

  const rootElement = await page.$(root);
  if (!rootElement) {
    return {
      msg: `期望选择器 ${root} 存在，实际值不存在`,
      score: 0,
      generatedImgBuffer: null,
    };
  }

  const screenshot = await rootElement.screenshot();
  const userImg = await Jimp.read(screenshot);
  const testImg = await Jimp.read(testImgBuffer);
  const { percent } = diff(userImg, testImg);

  const similarity = 1 - percent;

  if (similarity >= threshold) {
    return { msg: 'ok', score, generatedImgBuffer: screenshot };
  } else {
    return {
      msg: `相似度 ${similarity * 100}% 低于阈值 ${threshold * 100}%`,
      generatedImgBuffer: screenshot,
      score: 0,
    };
  }
}
