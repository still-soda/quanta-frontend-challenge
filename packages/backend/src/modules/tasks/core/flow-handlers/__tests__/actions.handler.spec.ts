import { Browser, chromium } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from '../actions/actions.handler';

describe('Actions Handler', () => {
  let browser: Browser;

  beforeAll(async () => {
    jest.mock('playwright');
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('handleMouseAction', () => {
    it('应该移动到指定位置', async () => {
      const page = await browser.newPage();
      const moveSpy = jest.spyOn(page.mouse, 'move');
      const moveMouseData = {
        x: 100,
        y: 200,
      };
      await handleMouseActions(page, {
        type: 'move',
        ...moveMouseData,
      });
      expect(moveSpy).toHaveBeenCalledWith(100, 200);
    });

    it('应该点击指定位置（坐标）', async () => {
      const page = await browser.newPage();
      const moveSpy = jest.spyOn(page.mouse, 'move');
      const downSpy = jest.spyOn(page.mouse, 'down');
      const upSpy = jest.spyOn(page.mouse, 'up');
      await handleMouseActions(page, {
        type: 'click',
        button: 'left',
        x: 100,
        y: 200,
      });
      expect(moveSpy).toHaveBeenCalledWith(100, 200);
      expect(downSpy).toHaveBeenCalledWith({ button: 'left' });
      expect(upSpy).toHaveBeenCalledWith({ button: 'left' });
      expect(downSpy).toHaveBeenCalledTimes(1);
      expect(upSpy).toHaveBeenCalledTimes(1);
    });

    it('应该点击指定位置（选择器）', async () => {
      const page = await browser.newPage();
      const clickSpy = jest
        .spyOn(page, 'click')
        .mockImplementation(() => ({}) as any);
      await handleMouseActions(page, {
        type: 'click',
        button: 'left',
        selector: 'input',
      });
      expect(clickSpy).toHaveBeenCalledWith('input', { button: 'left' });
    });

    it('应该双击指定位置（坐标）', async () => {
      const page = await browser.newPage();
      const moveSpy = jest.spyOn(page.mouse, 'move');
      const downSpy = jest.spyOn(page.mouse, 'down');
      const upSpy = jest.spyOn(page.mouse, 'up');
      await handleMouseActions(page, {
        type: 'dbclick',
        button: 'left',
        x: 100,
        y: 200,
      });
      expect(moveSpy).toHaveBeenCalledWith(100, 200);
      expect(downSpy).toHaveBeenCalledWith({ button: 'left' });
      expect(upSpy).toHaveBeenCalledWith({ button: 'left' });
      expect(downSpy).toHaveBeenCalledTimes(2);
      expect(upSpy).toHaveBeenCalledTimes(2);
    });

    it('应该双击指定位置（选择器）', async () => {
      const page = await browser.newPage();
      const clickSpy = jest
        .spyOn(page, 'click')
        .mockImplementation(() => ({}) as any);
      await handleMouseActions(page, {
        type: 'dbclick',
        button: 'left',
        selector: 'input',
      });
      expect(clickSpy).toHaveBeenCalledWith('input', { button: 'left' });
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });

    it('应该滚动到指定位置', async () => {
      const page = await browser.newPage();
      const wheelSpy = jest.spyOn(page.mouse, 'wheel');
      await handleMouseActions(page, {
        type: 'scroll',
        x: 100,
        y: 200,
      });
      expect(wheelSpy).toHaveBeenCalledWith(100, 200);
    });

    it('应该抛出未知的鼠标事件错误', async () => {
      const page = await browser.newPage();
      await expect(
        handleMouseActions(page, {
          type: 'unknown',
        } as any),
      ).rejects.toThrow('未知的鼠标事件');
    });
  });

  describe('handleTriggerAction', () => {
    it('应该触发blur事件', async () => {
      const page = await browser.newPage();
      const evalSpy = jest
        .spyOn(page, '$eval')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'blur',
        selector: 'input',
      });
      expect(evalSpy).toHaveBeenCalledWith('input', expect.any(Function));
    });

    it('应该触发focus事件', async () => {
      const page = await browser.newPage();
      const focusSpy = jest
        .spyOn(page, 'focus')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'focus',
        selector: 'input',
      });
      expect(focusSpy).toHaveBeenCalledWith('input');
    });

    it('应该触发hover事件', async () => {
      const page = await browser.newPage();
      const hoverSpy = jest
        .spyOn(page, 'hover')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'hover',
        selector: 'input',
      });
      expect(hoverSpy).toHaveBeenCalledWith('input');
    });

    it('应该触发drag事件', async () => {
      const page = await browser.newPage();
      const dragAndDropSpy = jest
        .spyOn(page, 'dragAndDrop')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'drag',
        from: 'input',
        to: 'button',
      });
      expect(dragAndDropSpy).toHaveBeenCalledWith('input', 'button');
    });

    it('应该触发input事件', async () => {
      const page = await browser.newPage();
      const fillSpy = jest
        .spyOn(page, 'fill')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'input',
        selector: 'input',
        value: 'test',
      });
      expect(fillSpy).toHaveBeenCalledWith('input', 'test');
    });

    it('应该触发wait事件', async () => {
      const page = await browser.newPage();
      const waitForTimeoutSpy = jest
        .spyOn(page, 'waitForTimeout')
        .mockImplementation(() => ({}) as any);
      await handleTriggerAction(page, {
        type: 'wait',
        time: 1000,
      });
      expect(waitForTimeoutSpy).toHaveBeenCalledWith(1000);
    });

    it('应该抛出未知的触发事件错误', async () => {
      const page = await browser.newPage();
      await expect(
        handleTriggerAction(page, {
          type: 'unknown',
        } as any),
      ).rejects.toThrow('未知的触发事件');
    });
  });
});
