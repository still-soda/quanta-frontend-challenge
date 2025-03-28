import { Browser, chromium, Page } from 'playwright';
import * as ActionsHandler from '../actions/actions.handler';
import * as TestpointsHandler from '../testpoints/testpoints.handler';
import {
  ExpectTestpointFlowData,
  HoverTriggerFlowData,
  MoveMouseFlowData,
  ScreenShotTestpointFlowData,
} from '../../flow-data';
import { handleOneFlowData } from '..';

jest.mock('../actions/actions.handler', () => ({
  handleMouseAction: jest.fn(),
  handleTriggerAction: jest.fn(),
}));

jest.mock('../testpoints/testpoints.handler', () => ({
  handleExpectTestpointAction: jest.fn(),
  handleScreenShotTestpointAction: jest.fn(),
  handleScreenShotTestpointPreAction: jest.fn(),
}));

const [
  handleMouseAction,
  handleTriggerAction,
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
  handleScreenShotTestpointPreAction,
] = [
  ActionsHandler.handleMouseAction,
  ActionsHandler.handleTriggerAction,
  TestpointsHandler.handleExpectTestpointAction,
  TestpointsHandler.handleScreenShotTestpointAction,
  TestpointsHandler.handleScreenShotTestpointPreAction,
] as jest.Mock[];

describe('Flow Data Handler Index', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('应该正确转发 mouse-flow-data（成功）', async () => {
    handleMouseAction.mockClear().mockResolvedValue({
      success: true,
      msg: 'ok',
      score: 0,
    });

    const data: MoveMouseFlowData = {
      type: 'mouse',
      detail: { type: 'move' },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleMouseAction).toHaveBeenCalledTimes(1);
    expect(handleMouseAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: true,
      msg: 'ok',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 mouse-flow-data（失败，调用抛出异常）', async () => {
    handleMouseAction.mockClear().mockRejectedValue(new Error('error'));

    const data: MoveMouseFlowData = {
      type: 'mouse',
      detail: { type: 'move' },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleMouseAction).toHaveBeenCalledTimes(1);
    expect(handleMouseAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: false,
      msg: 'error',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 trigger-flow-data（成功）', async () => {
    handleTriggerAction.mockClear().mockResolvedValue({
      success: true,
      msg: 'ok',
      score: 0,
    });

    const data: HoverTriggerFlowData = {
      type: 'trigger',
      detail: { type: 'hover', selector: '#test' },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleTriggerAction).toHaveBeenCalledTimes(1);
    expect(handleTriggerAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: true,
      msg: 'ok',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 trigger-flow-data（失败，调用抛出异常）', async () => {
    handleTriggerAction.mockClear().mockRejectedValue(new Error('error'));

    const data: HoverTriggerFlowData = {
      type: 'trigger',
      detail: { type: 'hover', selector: '#test' },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleTriggerAction).toHaveBeenCalledTimes(1);
    expect(handleTriggerAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: false,
      msg: 'error',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（expect，成功）', async () => {
    handleExpectTestpointAction.mockClear().mockResolvedValue({
      msg: 'ok',
      score: 20,
    });

    const data: ExpectTestpointFlowData = {
      type: 'testpoint',
      detail: { type: 'expect', name: 'test', score: 20 },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleExpectTestpointAction).toHaveBeenCalledTimes(1);
    expect(handleExpectTestpointAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: true,
      msg: 'ok',
      score: 20,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（expect，失败，调用抛出异常）', async () => {
    handleExpectTestpointAction
      .mockClear()
      .mockRejectedValue(new Error('error'));

    const data: ExpectTestpointFlowData = {
      type: 'testpoint',
      detail: { type: 'expect', name: 'test', score: 20 },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleExpectTestpointAction).toHaveBeenCalledTimes(1);
    expect(handleExpectTestpointAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
    });
    expect(result).toEqual({
      success: false,
      msg: 'error',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（screenshot，成功）', async () => {
    handleScreenShotTestpointAction.mockClear().mockResolvedValue({
      msg: 'ok',
      score: 20,
    });

    const data: ScreenShotTestpointFlowData & {
      detail: { testImgBuffer: Buffer };
    } = {
      type: 'testpoint',
      detail: {
        type: 'screenshot',
        name: 'test',
        score: 20,
        root: 'body',
        threshold: 1,
        testImgBuffer: Buffer.from('test'),
      },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleScreenShotTestpointAction).toHaveBeenCalledTimes(1);
    expect(handleScreenShotTestpointAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
      testImgBuffer: data.detail.testImgBuffer,
    });
    expect(result).toEqual({
      success: true,
      msg: 'ok',
      score: 20,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（screenshot，失败，调用抛出异常）', async () => {
    handleScreenShotTestpointAction
      .mockClear()
      .mockRejectedValue(new Error('error'));

    const data: ScreenShotTestpointFlowData & {
      detail: { testImgBuffer: Buffer };
    } = {
      type: 'testpoint',
      detail: {
        type: 'screenshot',
        name: 'test',
        score: 20,
        root: 'body',
        threshold: 1,
        testImgBuffer: Buffer.from('test'),
      },
    };
    const result = await handleOneFlowData(page, data);

    expect(handleScreenShotTestpointAction).toHaveBeenCalledTimes(1);
    expect(handleScreenShotTestpointAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
      testImgBuffer: data.detail.testImgBuffer,
    });
    expect(result).toEqual({
      success: false,
      msg: 'error',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（screenshot，pre，成功）', async () => {
    handleScreenShotTestpointPreAction.mockClear().mockResolvedValue({
      msg: 'ok',
      score: 20,
    });

    const data: ScreenShotTestpointFlowData & {
      detail: { testImgBuffer: Buffer };
    } = {
      type: 'testpoint',
      detail: {
        type: 'screenshot',
        name: 'test',
        score: 20,
        root: 'body',
        threshold: 1,
        testImgBuffer: Buffer.from('test'),
      },
    };
    const result = await handleOneFlowData(page, data, true);

    expect(handleScreenShotTestpointPreAction).toHaveBeenCalledTimes(1);
    expect(handleScreenShotTestpointPreAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
      testImgBuffer: data.detail.testImgBuffer,
    });
    expect(result).toEqual({
      success: true,
      msg: 'ok',
      score: 20,
      generateImgBuffer: null,
    });
  });

  it('应该正确转发 testpoint-flow-data（screenshot，pre，失败，调用抛出异常）', async () => {
    handleScreenShotTestpointPreAction
      .mockClear()
      .mockRejectedValue(new Error('error'));

    const data: ScreenShotTestpointFlowData & {
      detail: { testImgBuffer: Buffer };
    } = {
      type: 'testpoint',
      detail: {
        type: 'screenshot',
        name: 'test',
        score: 20,
        root: 'body',
        threshold: 1,
        testImgBuffer: Buffer.from('test'),
      },
    };
    const result = await handleOneFlowData(page, data, true);

    expect(handleScreenShotTestpointPreAction).toHaveBeenCalledTimes(1);
    expect(handleScreenShotTestpointPreAction).toHaveBeenCalledWith({
      page,
      detail: data.detail,
      testImgBuffer: data.detail.testImgBuffer,
    });
    expect(result).toEqual({
      success: false,
      msg: 'error',
      score: 0,
      generateImgBuffer: null,
    });
  });

  it('应该正确处理未知的流程数据类型', async () => {
    const data = { type: 'unknown' } as any;
    const result = await handleOneFlowData(page, data);
    expect(result).toEqual({
      success: false,
      msg: '未知的流程数据类型',
      score: 0,
      generateImgBuffer: null,
    });
  });
});
