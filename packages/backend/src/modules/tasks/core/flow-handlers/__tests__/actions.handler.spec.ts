import { Browser, chromium, Page } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from '../actions/actions.handler';

describe('Actions Handler', () => {
  let browser: Browser;

  beforeAll(async () => {
    jest.mock('playwright');
    browser = await chromium.launch();
  });

  describe('handleMouseAction', () => {
    it('应该移动到指定位置', async () => {
      const page = await browser.newPage();
      const moveMouseData = {
        x: 100,
        y: 200,
      };
      await handleMouseActions(page, {
        type: 'move',
        ...moveMouseData,
      });
      expect(page.mouse.move).toHaveBeenCalledWith(100, 200);
    });

    it('应该点击指定位置', async () => {
      const page = await browser.newPage();
      await handleMouseActions(page, {
        type: 'click',
      });
      expect(page.mouse.click).toHaveBeenCalled();
    });

    it('应该双击指定位置', async () => {
      const page = await browser.newPage();
      await handleMouseActions(page, {
        type: 'dbclick',
      });
      expect(page.mouse.dblclick).toHaveBeenCalled();
    });

    it('应该滚动到指定位置', async () => {
      const page = await browser.newPage();
      const scrollMouseData = {
        x: 100,
        y: 200,
      };
      await handleMouseActions(page, {
        type: 'scroll',
        ...scrollMouseData,
      });
      expect(page.mouse.wheel).toHaveBeenCalledWith(100, 200);
    });
  });

  describe('handleTriggerAction', () => {});
});
