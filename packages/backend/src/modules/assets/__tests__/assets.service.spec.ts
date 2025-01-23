import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from '../assets.service';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from '../assets.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import mongoose from 'mongoose';
import { uuidFileNameRegEndWith } from '../../../utils/testing.utils';

describe('AssetsService', () => {
  let service: AssetsService;
  let txtFile: File;
  let jpgFile: File;
  let mongodb: MongoMemoryServer;
  const fileNames: string[] = [];
  const staticFileNames: string[] = [];

  beforeAll(async () => {
    const mockMongo = await createMockDBModule();
    mongodb = mockMongo.mongodb;
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
        mockMongo.module,
        AssetsModule,
      ],
      providers: [AssetsService],
    }).compile();

    txtFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    jpgFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    service = module.get<AssetsService>(AssetsService);
  });

  afterAll(async () => {
    const deleteFilePromise = Array.from(new Set(fileNames)).map((fileName) =>
      service.deleteFile(fileName),
    );
    const deleteStaticFilePromise = Array.from(new Set(staticFileNames)).map(
      (fileName) => service.deleteStaticFile(fileName),
    );
    await Promise.allSettled([
      ...deleteFilePromise,
      ...deleteStaticFilePromise,
    ]);
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取 service', async () => {
    expect(service).toBeDefined();
  });

  describe('应该正确保存文件', () => {
    test('txt', async () => {
      const txtResult = await service.saveFile({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      expect(txtResult.ok).toBe(true);
      expect(txtResult.fileName).toMatch(uuidFileNameRegEndWith('.txt'));
      fileNames.push(txtResult.fileName);
    });

    test('jpg', async () => {
      const jpgResult = await service.saveFile({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'text/plain',
      });
      expect(jpgResult.ok).toBe(true);
      expect(jpgResult.fileName).toMatch(uuidFileNameRegEndWith('.jpg'));
      fileNames.push(jpgResult.fileName);
    });

    test('buffer', async () => {
      const buffer = Buffer.from('test');
      const bufferResult = await service.saveFile({
        file: buffer,
        name: 'test.bin',
        mimeType: 'application/octet-stream',
      });
      expect(bufferResult.ok).toBe(true);
      expect(bufferResult.fileName).toMatch(uuidFileNameRegEndWith('.bin'));
      fileNames.push(bufferResult.fileName);
    });
  });

  describe('应该正确保存静态文件', () => {
    test('txt', async () => {
      const txtResult = await service.saveFileAsStatic({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      expect(txtResult.ok).toBe(true);
      expect(txtResult.fileName).toMatch(uuidFileNameRegEndWith('.txt'));
      staticFileNames.push(txtResult.fileName);
    });

    test('jpg', async () => {
      const jpgResult = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      expect(jpgResult.ok).toBe(true);
      expect(jpgResult.fileName).toMatch(uuidFileNameRegEndWith('.jpg'));
      staticFileNames.push(jpgResult.fileName);
    });

    test('buffer', async () => {
      const buffer = Buffer.from('test');
      const bufferResult = await service.saveFileAsStatic({
        file: buffer,
        name: 'test.bin',
        mimeType: 'application/octet-stream',
      });
      expect(bufferResult.ok).toBe(true);
      expect(bufferResult.fileName).toMatch(uuidFileNameRegEndWith('.bin'));
      staticFileNames.push(bufferResult.fileName);
    });
  });

  it('应该正确保存文本文件', async () => {
    const text = 'Hello, World!';
    const result = await service.saveTextFile({
      content: text,
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    expect(result.ok).toBe(true);
    expect(result.fileName).toMatch(uuidFileNameRegEndWith('.txt'));
    fileNames.push(result.fileName);
  });

  it('不应该保存空文本文件', async () => {
    const result = await service.saveTextFile({
      content: '',
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    expect(result.ok).toBe(false);
  });

  describe('应该在文本文件为 undefined 或 null 的时候保存失败', () => {
    test('undefined', async () => {
      await expect(
        service.saveTextFile({
          content: undefined,
          name: 'test.txt',
          mimeType: 'text/plain',
        }),
      ).resolves.toHaveProperty('ok', false);
    });

    test('null', async () => {
      await expect(
        service.saveTextFile({
          content: null,
          name: 'test.txt',
          mimeType: 'text/plain',
        }),
      ).resolves.toHaveProperty('ok', false);
    });
  });

  it('应该正确保存静态文本文件', async () => {
    const text = 'Hello, World!';
    const result = await service.saveTextFileAsStatic({
      content: text,
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    expect(result.ok).toBe(true);
    expect(result.fileName).toMatch(uuidFileNameRegEndWith('.txt'));
    staticFileNames.push(result.fileName);
  });

  describe('应该在文本文件为 undefined 或 null 的时候保存失败（静态版）', () => {
    test('undefined', async () => {
      await expect(
        service.saveTextFileAsStatic({
          content: undefined,
          name: 'test.txt',
          mimeType: 'text/plain',
        }),
      ).resolves.toHaveProperty('ok', false);
    });

    test('null', async () => {
      await expect(
        service.saveTextFileAsStatic({
          content: null,
          name: 'test.txt',
          mimeType: 'text/plain',
        }),
      ).resolves.toHaveProperty('ok', false);
    });
  });

  it('不应该保存空静态文本文件', async () => {
    const result = await service.saveTextFileAsStatic({
      content: '',
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    expect(result.ok).toBe(false);
  });

  it('应该正确获取文本文件内容', async () => {
    const text = 'Hello, World!';
    const { fileName } = await service.saveTextFile({
      content: text,
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    const result = await service.readTextFile(fileName);
    expect(result).toBe(text);
    fileNames.push(fileName);
  });

  it('应该正确获取静态文本文件内容', async () => {
    const text = 'Hello, World!';
    const { fileName } = await service.saveTextFileAsStatic({
      content: text,
      name: 'test.txt',
      mimeType: 'text/plain',
    });
    const result = await service.readStaticTextFile(fileName);
    expect(result).toBe(text);
    staticFileNames.push(fileName);
  });

  it('不存在文本文件时应该返回空字符串', async () => {
    const result = await service.readTextFile('non-exists');
    expect(result).toBe('');
  });

  it('不存在静态文本文件时应该返回空字符串', async () => {
    const result = await service.readStaticTextFile('non-exists');
    expect(result).toBe('');
  });

  describe('应该正确获取文件', () => {
    test('txt', async () => {
      const { fileName: txtFileName } = await service.saveFile({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      const txtResult = await service.getFileByName(txtFileName);
      expect(txtResult).not.toBeNull();
      fileNames.push(txtFileName);
    });

    test('jpg', async () => {
      const { fileName: jpgFileName } = await service.saveFile({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const jpgResult = await service.getFileByName(jpgFileName);
      expect(jpgResult).not.toBeNull();
      fileNames.push(jpgFileName);
    });

    test('non-exists', async () => {
      const nonExistsResult = await service.getFileByName('non-exists');
      expect(nonExistsResult).toBeNull();
    });
  });

  describe('应该正确获取静态文件', () => {
    test('txt', async () => {
      const { fileName: txtFileName } = await service.saveFileAsStatic({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      const txtResult = await service.getStaticFile(txtFileName);
      expect(txtResult).not.toBeNull();
      staticFileNames.push(txtFileName);
    });

    test('jpg', async () => {
      const { fileName: jpgFileName } = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const jpgResult = await service.getStaticFile(jpgFileName);
      expect(jpgResult).not.toBeNull();
      staticFileNames.push(jpgFileName);
    });

    test('non-exists', async () => {
      const nonExistsResult = await service.getStaticFile('non-exists');
      expect(nonExistsResult).toBeNull();
    });
  });

  describe('应该正确删除文件', () => {
    test('txt', async () => {
      const { fileName: txtFileName } = await service.saveFile({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      const txtResult = await service.deleteFile(txtFileName);
      expect(txtResult).toBe(true);
    });

    test('jpg', async () => {
      const { fileName: jpgFileName } = await service.saveFile({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const jpgResult = await service.deleteFile(jpgFileName);
      expect(jpgResult).toBe(true);
    });

    test('non-exists', async () => {
      const nonExistsResult = await service.deleteFile('non-exists');
      expect(nonExistsResult).toBe(true);
    });
  });

  describe('应该正确删除静态文件', () => {
    test('txt', async () => {
      const { fileName: txtFileName } = await service.saveFileAsStatic({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      const txtResult = await service.deleteStaticFile(txtFileName);
      expect(txtResult).toBe(true);
    });

    test('jpg', async () => {
      const { fileName: jpgFileName } = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const jpgResult = await service.deleteStaticFile(jpgFileName);
      expect(jpgResult).toBe(true);
    });

    test('non-exists', async () => {
      const nonExistsResult = await service.deleteStaticFile('non-exists');
      expect(nonExistsResult).toBe(true);
    });
  });

  describe('应该正确判断文件是否存在', () => {
    test('txt', async () => {
      const { fileName: txtFileName } = await service.saveFile({
        file: txtFile,
        name: 'test.txt',
        mimeType: 'text/plain',
      });
      const txtResult = await service.isFileExists({ fileName: txtFileName });
      expect(txtResult.exists).toBe(true);
      expect(txtResult.isStatic).toBe(false);
      fileNames.push(txtFileName);
    });

    test('jpg', async () => {
      const { fileName: jpgFileName } = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const jpgResult = await service.isFileExists({ fileName: jpgFileName });
      expect(jpgResult.exists).toBe(true);
      expect(jpgResult.isStatic).toBe(true);
      staticFileNames.push(jpgFileName);
    });

    test('non-exists', async () => {
      const nonExistsResult = await service.isFileExists({
        fileName: 'non-exists',
      });
      expect(nonExistsResult.exists).toBe(false);
      expect(nonExistsResult.isStatic).toBe(false);
    });
  });

  it('不能通过非静态访问获取静态文件', async () => {
    const { fileName } = await service.saveFileAsStatic({
      file: jpgFile,
      name: 'test.jpg',
      mimeType: 'image/jpeg',
    });
    const result = await service.getFileByName(fileName);
    expect(result).toBeNull();
    staticFileNames.push(fileName);
  });

  it('不能通过静态访问获取非静态文件', async () => {
    const { fileName } = await service.saveFile({
      file: jpgFile,
      name: 'test.jpg',
      mimeType: 'image/jpeg',
    });
    const result = await service.getStaticFile(fileName);
    expect(result).toBeNull();
    fileNames.push(fileName);
  });

  describe('应该正确存储元数据到数据库', () => {
    test('non-static（id）', async () => {
      const { id } = await service.saveFile({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const result = await service.getFileMetadataById(id);
      expect(result).not.toBeNull();
      expect(result.id).toBe(id);
      expect(result.name).toBe('test.jpg');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.isStatic).toBe(false);
      fileNames.push(result.localName);
    });

    test('non-static（fileName）', async () => {
      const { fileName } = await service.saveFile({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const result = await service.getFileMetadataByName(fileName);
      expect(result).not.toBeNull();
      expect(result.localName).toBe(fileName);
      expect(result.name).toBe('test.jpg');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.isStatic).toBe(false);
      fileNames.push(fileName);
    });

    test('static（id）', async () => {
      const { id } = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const result = await service.getFileMetadataById(id);
      expect(result).not.toBeNull();
      expect(result.id).toBe(id);
      expect(result.name).toBe('test.jpg');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.isStatic).toBe(true);
      staticFileNames.push(result.localName);
    });

    test('static（fileName）', async () => {
      const { fileName } = await service.saveFileAsStatic({
        file: jpgFile,
        name: 'test.jpg',
        mimeType: 'image/jpeg',
      });
      const result = await service.getFileMetadataByName(fileName);
      expect(result).not.toBeNull();
      expect(result.localName).toBe(fileName);
      expect(result.name).toBe('test.jpg');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.isStatic).toBe(true);
      staticFileNames.push(fileName);
    });
  });

  describe('应该正确获取元数据', () => {
    beforeAll(async () => {
      const createdFileNames: string[] = [];
      const createdStaticFileNames: string[] = [];
      const promises: Promise<any>[] = [];
      for (let i = 0; i < 20; i++) {
        const fn = i < 10 ? service.saveFileAsStatic : service.saveFile;
        const nameList = i < 10 ? createdStaticFileNames : createdFileNames;
        const promise = fn
          .call(service, {
            file: txtFile,
            name: 'test.json',
            mimeType: 'application/json',
          })
          .then(({ fileName }) => {
            nameList.push(fileName);
          });
        promises.push(promise);
      }
      await Promise.allSettled(promises);
      staticFileNames.push(...createdStaticFileNames);
      fileNames.push(...createdFileNames);
    });

    test('获取全部数据', async () => {
      const list =
        await service.getFileMatadataListByMimeType('application/json');
      expect(list.length).toBe(20);
      expect(list.filter((i) => i.isStatic).length).toBe(10);
    });

    test('获取静态数据', async () => {
      const list = await service.getFileMatadataListByMimeType(
        'application/json',
        { only: 'static' },
      );
      expect(list.length).toBe(10);
    });

    test('限制获取 10 条数据', async () => {
      const list = await service.getFileMatadataListByMimeType(
        'application/json',
        { count: 10 },
      );
      expect(list.length).toBe(10);
    });

    test('跳过 10 条数据', async () => {
      const allList =
        await service.getFileMatadataListByMimeType('application/json');
      const skipList = await service.getFileMatadataListByMimeType(
        'application/json',
        { skip: 10 },
      );
      expect(skipList.length).toBe(10);
      expect(allList[10]).toEqual(skipList[0]);
    });
  });

  test('获取不存在的元数据', async () => {
    const meta = await service.getFileMetadataByName('non-exist');
    expect(meta).toBeNull();
  });
});
