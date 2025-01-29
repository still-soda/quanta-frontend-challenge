import { Test, TestingModule } from '@nestjs/testing';
import {
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
  handleScreenShotTestpointPreAction,
} from '../testpoints/testpoints.handler';
import { Browser, chromium } from 'playwright';
import { createEnvConfModule } from '../../../../../utils/create-env-conf.utils';

describe('Testpoints Handler', () => {
  let module: TestingModule;
  let browser: Browser;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [createEnvConfModule()],
    }).compile();

    browser = await chromium.launch({ headless: true });
  });

  afterAll(() => {
    browser.close();
    module.close();
  });

  describe('handleExpectTestpointAction', () => {
    describe('exist', () => {
      it('应该能够正确判断是否存在元素（存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            exist: true,
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('应该能够正确判断是否存在元素（不存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test1',
            exist: false,
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('应该能够正确判断是否存在元素（存在，但不应该存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            exist: false,
          },
        });
        expect(msg).toBe('期望选择器 #test 不存在，但实际存在');
        expect(score).toBe(0);
        await page.close();
      });

      it('应该能够正确判断是否存在元素（不存在，但应该存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test1',
            exist: true,
          },
        });
        expect(msg).toBe('期望选择器 #test1 存在，但实际不存在');
        expect(score).toBe(0);
        await page.close();
      });
    });

    describe('text', () => {
      it('应该能够正确判断元素文本是否正确（正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">test</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: 'test',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('应该能够正确判断元素文本是否正确（错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">test</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: 'test1',
          },
        });
        expect(msg).toBe('期望选择器 #test 的文本为 test1，实际值为 test');
        expect(score).toBe(0);
        await page.close();
      });

      it('应该能够正确判断元素文本是否正确（元素不存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">test</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test1',
            text: 'test',
          },
        });
        expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
        expect(score).toBe(0);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，eq，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '123',
            typeParser: 'number',
            compare: 'eq',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，eq，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '1234',
            typeParser: 'number',
            compare: 'eq',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的文本为 1234，实际值为 123（use number parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，gt，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '122',
            typeParser: 'number',
            compare: 'gt',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，gt，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '123',
            typeParser: 'number',
            compare: 'gt',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的文本大于 123，实际值为 123（use number parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，lt，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '124',
            typeParser: 'number',
            compare: 'lt',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（number，lt，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">123</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: '123',
            typeParser: 'number',
            compare: 'lt',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的文本小于 123，实际值为 123（use number parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（boolean，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">true</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: 'true',
            typeParser: 'boolean',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对文本使用类型转换时应该能够正确判断元素文本是否正确（boolean，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test">true</div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            text: 'false',
            typeParser: 'boolean',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的文本为 false，实际值为 true（use boolean parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('正确判断元素属性是否正确（正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: 'test',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('正确判断元素属性是否正确（错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: 'test1',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的属性 data-test 为 test1，实际值为 test',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('正确判断元素属性是否正确（元素不存在）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="test"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test1',
            attr: 'data-test',
            text: 'test',
          },
        });
        expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
        expect(score).toBe(0);
        await page.close();
      });

      it('在对属性使用类型转换时应该能够正确判断元素属性是否正确（number，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="123"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: '123',
            typeParser: 'number',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对属性使用类型转换时应该能够正确判断元素属性是否正确（number，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="123"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: '1234',
            typeParser: 'number',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的属性 data-test 为 1234，实际值为 123（use number parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });

      it('在对属性使用类型转换时应该能够正确判断元素属性是否正确（boolean，正确）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="true"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: 'true',
            typeParser: 'boolean',
          },
        });
        expect(msg).toBe('ok');
        expect(score).toBe(20);
        await page.close();
      });

      it('在对属性使用类型转换时应该能够正确判断元素属性是否正确（boolean，错误）', async () => {
        const page = await browser.newPage();
        await page.setContent('<div id="test" data-test="true"></div>');

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test',
            attr: 'data-test',
            text: 'false',
            typeParser: 'boolean',
          },
        });
        expect(msg).toBe(
          '期望选择器 #test 的属性 data-test 为 false，实际值为 true（use boolean parser）',
        );
        expect(score).toBe(0);
        await page.close();
      });
    });

    describe('style', () => {
      it.each([
        [
          '全部正确',
          20,
          {
            color: { value: 'rgb(255, 0, 0)', compare: 'eq' },
            'background-color': { value: 'rgb(0, 0, 0)', compare: 'eq' },
          },
          'ok;;ok',
        ],
        [
          '部分正确',
          10,
          {
            color: { value: 'rgb(255, 0, 0)', compare: 'eq' },
            'background-color': { value: 'rgb(255, 0, 0)', compare: 'eq' },
          },
          'ok;;期望选择器 #test 的样式 background-color 为 rgb(255, 0, 0)，实际值为 rgb(0, 0, 0)',
        ],
        [
          '全部错误',
          0,
          {
            color: { value: 'rgb(0, 0, 0)', compare: 'eq' },
            'background-color': { value: 'rgb(255, 0, 0)', compare: 'eq' },
          },
          '期望选择器 #test 的样式 color 为 rgb(0, 0, 0)，实际值为 rgb(255, 0, 0);;期望选择器 #test 的样式 background-color 为 rgb(255, 0, 0)，实际值为 rgb(0, 0, 0)',
        ],
      ])(
        '应该能够正确判断元素样式是否正确（%s）',
        async (_, expectScore, style, expectMsg) => {
          const page = await browser.newPage();
          await page.setContent(
            '<div id="test" style="color: red; background-color: black;"></div>',
          );

          const { msg, score } = await handleExpectTestpointAction({
            page,
            detail: {
              name: 'test',
              score: 20,
              type: 'expect',
              selector: '#test',
              style: style as any,
            },
          });
          expect(msg).toBe(expectMsg);
          expect(score).toBe(expectScore);
          await page.close();
        },
      );

      it('应该能够正确判断元素样式是否正确（元素不存在）', async () => {
        const page = await browser.newPage();
        await page.setContent(
          '<div id="test" style="color: red; background-color: black;"></div>',
        );

        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'expect',
            selector: '#test1',
            style: {
              color: { value: 'rgb(255, 0, 0)', compare: 'eq' },
              'background-color': { value: 'rgb(0, 0, 0)', compare: 'eq' },
            },
          },
        });
        expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
        expect(score).toBe(0);
        await page.close();
      });
    });
  });

  describe('handleScreenShotTestpointPreAction', () => {
    it('应该能够正确产生截图（返回结果正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { msg, score, generatedImgBuffer } =
        await handleScreenShotTestpointPreAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'screenshot',
            root: '#test',
            threshold: 0.9,
          },
        });
      expect(msg).toBe('ok');
      expect(generatedImgBuffer).toBeInstanceOf(Buffer);
      expect(score).toBe(20);
      await page.close();
    });

    it('不存在元素时不能产生截图（返回结果正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { msg, score, generatedImgBuffer } =
        await handleScreenShotTestpointPreAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'screenshot',
            root: '#test1',
            threshold: 0.9,
          },
        });
      expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
      expect(generatedImgBuffer).toBe(null);
      expect(score).toBe(0);
      await page.close();
    });
  });

  describe('handleScreenShotTestpointAction', () => {
    it('应该能够正确判断截图是否正确（正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { generatedImgBuffer } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
      });
      expect(generatedImgBuffer).toBeInstanceOf(Buffer);

      const {
        msg,
        score,
        generatedImgBuffer: buffer,
      } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 1,
          root: '#test',
        },
        testImgBuffer: generatedImgBuffer,
      });
      expect(msg).toBe('ok');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(score).toBe(20);
      await page.close();
    });

    it('应该能够正确判断截图是否正确（错误）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { generatedImgBuffer } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
      });
      expect(generatedImgBuffer).toBeInstanceOf(Buffer);

      await page.setContent(
        '<div id="test" style="background: red">1234</div>',
      );

      const {
        msg,
        score,
        generatedImgBuffer: buffer,
      } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 0.9,
          root: '#test',
        },
        testImgBuffer: generatedImgBuffer,
      });
      expect(msg).toMatch(/相似度 \d+\.?\d*% 低于阈值 90%/);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(score).toBe(0);
      await page.close();
    });

    it('不存在元素时不能产生截图应该返回 0 分', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { generatedImgBuffer } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
      });
      expect(generatedImgBuffer).toBeInstanceOf(Buffer);

      const {
        msg,
        score,
        generatedImgBuffer: buffer,
      } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 0.9,
          root: '#test1',
        },
        testImgBuffer: generatedImgBuffer,
      });
      expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
      expect(buffer).toBe(null);
      expect(score).toBe(0);
      await page.close();
    });
  });
});
