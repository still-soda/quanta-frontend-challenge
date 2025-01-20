import { Test, TestingModule } from '@nestjs/testing';
import {
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
  handleScreenShotTestpointPreAction,
} from '../testpoints/testpoints.handler';
import { AssetsModule } from '../../../../assets/assets.module';
import { AssetsService } from '../../../../assets/assets.service';
import { Browser, chromium } from 'playwright';
import { createEnvConfModule } from '../../../../../utils/create-env-conf.utils';

describe('Testpoints Handler', () => {
  let assetsService: AssetsService;
  let browser: Browser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AssetsModule, createEnvConfModule()],
    }).compile();

    assetsService = module.get<AssetsService>(AssetsService);

    browser = await chromium.launch({ headless: true });
  });

  afterAll(() => {
    browser.close();
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
  });

  describe('handleScreenShotTestpointPreAction', () => {
    it('应该能够正确产生截图（返回结果正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { msg, score, testImageName } =
        await handleScreenShotTestpointPreAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'screenshot',
            root: '#test',
            threshold: 0.9,
          },
          assetsService,
        });
      expect(msg).toBe('ok');
      expect(testImageName).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}.png$/,
      );
      expect(score).toBe(20);
      await page.close();
    });

    it('应该能够正确产生截图（存在截图）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { testImageName } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
        assetsService,
      });
      expect(testImageName).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}.png$/,
      );

      const { exists } = assetsService.isFileExists(testImageName);
      expect(exists).toBe(true);

      await page.close();
    });

    it('不存在元素时不能产生截图（返回结果正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { msg, score, testImageName } =
        await handleScreenShotTestpointPreAction({
          page,
          detail: {
            name: 'test',
            score: 20,
            type: 'screenshot',
            root: '#test1',
            threshold: 0.9,
          },
          assetsService,
        });
      expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
      expect(testImageName).toBe('');
      expect(score).toBe(0);
      await page.close();
    });
  });

  describe('handleScreenShotTestpointAction', () => {
    it('应该能够正确判断截图是否正确（正确）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { testImageName } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
        assetsService,
      });
      expect(testImageName).not.toBe('');

      const { msg, score } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 1,
          root: '#test',
        },
        testImageName,
        assetsService,
      });
      expect(msg).toBe('ok');
      expect(score).toBe(20);
      await page.close();
    });

    it('应该能够正确判断截图是否正确（错误）', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { testImageName } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
        assetsService,
      });
      expect(testImageName).not.toBe('');

      await page.setContent(
        '<div id="test" style="background: red">1234</div>',
      );

      const { msg, score } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 0.9,
          root: '#test',
        },
        testImageName,
        assetsService,
      });
      expect(msg).toMatch(/相似度 \d+\.?\d*% 低于阈值 90%/);
      expect(score).toBe(0);
      await page.close();
    });

    it('不存在元素时不能产生截图应该返回 0 分', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { testImageName } = await handleScreenShotTestpointPreAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          root: '#test',
          threshold: 0.9,
        },
        assetsService,
      });

      const { msg, score } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 0.9,
          root: '#test1',
        },
        testImageName,
        assetsService,
      });
      expect(msg).toBe('期望选择器 #test1 存在，实际值不存在');
      expect(score).toBe(0);
      await page.close();
    });

    it('找不到参考图片时应该抛出异常并返回 0 分', async () => {
      const page = await browser.newPage();
      await page.setContent('<div id="test">123</div>');

      const { msg, score } = await handleScreenShotTestpointAction({
        page,
        detail: {
          name: 'test',
          score: 20,
          type: 'screenshot',
          threshold: 0.9,
          root: '#test',
        },
        testImageName: 'not-exists.png',
        assetsService,
      });
      expect(msg).toBe('参考图片 not-exists.png 不存在');
      expect(score).toBe(0);
      await page.close();
    });
  });
});
