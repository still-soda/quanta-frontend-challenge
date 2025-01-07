import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from '../assets.service';
import { ConfigModule } from '@nestjs/config';

describe('AssetsService', () => {
  let service: AssetsService;
  let txtFile: File;
  let jpgFile: File;
  const fileNames: string[] = [];
  const staticFileNames: string[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
      ],
      providers: [AssetsService],
    }).compile();

    txtFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    jpgFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    service = module.get<AssetsService>(AssetsService);
  });

  afterAll(async () => {
    fileNames.forEach((fileName) => {
      service.deleteFile(fileName);
    });
    staticFileNames.forEach((fileName) => {
      service.deleteStaticFile(fileName);
    });
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  // 应该正确保存文件
  it('should save file correctly', async () => {
    // txt
    const txtResult = await service.saveFile(txtFile, 'test.txt');
    expect(txtResult.ok).toBe(true);
    expect(txtResult.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.txt$/,
    );
    // jpg
    const jpgResult = await service.saveFile(jpgFile, 'test.jpg');
    expect(jpgResult.ok).toBe(true);
    expect(jpgResult.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.jpg$/,
    );

    fileNames.push(txtResult.fileName, jpgResult.fileName);
  });

  // 应该正确保存静态文件
  it('should save static file correctly', async () => {
    // txt
    const txtResult = await service.saveFileAsStatic(txtFile, 'test.txt');
    expect(txtResult.ok).toBe(true);
    expect(txtResult.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.txt$/,
    );
    // jpg
    const jpgResult = await service.saveFileAsStatic(jpgFile, 'test.jpg');
    expect(jpgResult.ok).toBe(true);
    expect(jpgResult.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.jpg$/,
    );

    staticFileNames.push(txtResult.fileName, jpgResult.fileName);
  });

  // 应该正确保存文本文件
  it('should save text file correctly', async () => {
    const text = 'Hello, World!';
    const result = await service.saveTextFile(text, 'test.txt');
    expect(result.ok).toBe(true);
    expect(result.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.txt$/,
    );

    fileNames.push(result.fileName);
  });

  // 不应该保存空文本文件
  it('should not save empty text file', async () => {
    const result = await service.saveTextFile('', 'test.txt');
    expect(result.ok).toBe(false);
  });

  // 应该正确保存静态文本文件
  it('should save static text file correctly', async () => {
    const text = 'Hello, World!';
    const result = await service.saveTextFileAsStatic(text, 'test.txt');
    expect(result.ok).toBe(true);
    expect(result.fileName).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.txt$/,
    );

    staticFileNames.push(result.fileName);
  });

  // 不应该保存空静态文本文件
  it('should not save empty static text file', async () => {
    const result = await service.saveTextFileAsStatic('', 'test.txt');
    expect(result.ok).toBe(false);
  });

  // 应该正确获取文本文件内容
  it('should get text file content correctly', async () => {
    const text = 'Hello, World!';
    const { fileName } = await service.saveTextFile(text, 'test.txt');
    const result = service.readTextFile(fileName);
    expect(result).toBe(text);

    fileNames.push(fileName);
  });

  // 应该正确获取静态文本文件内容
  it('should get static text file content correctly', async () => {
    const text = 'Hello, World!';
    const { fileName } = await service.saveTextFileAsStatic(text, 'test.txt');
    const result = service.readStaticTextFile(fileName);
    expect(result).toBe(text);

    staticFileNames.push(fileName);
  });

  // 不存在文本文件时应该返回空字符串
  it('should return empty string when text file not exists', async () => {
    const result = service.readTextFile('non-exists');
    expect(result).toBe('');
  });

  // 不存在静态文本文件时应该返回空字符串
  it('should return empty string when static text file not exists', async () => {
    const result = service.readStaticTextFile('non-exists');
    expect(result).toBe('');
  });

  // 应该正确获取文件
  it('should get file correctly', async () => {
    // txt
    const { fileName: txtFileName } = await service.saveFile(
      txtFile,
      'test.txt',
    );
    const txtResult = service.getFile(txtFileName);
    expect(txtResult).not.toBeNull();
    // jpg
    const { fileName: jpgFileName } = await service.saveFile(
      jpgFile,
      'test.jpg',
    );
    const jpgResult = service.getFile(jpgFileName);
    expect(jpgResult).not.toBeNull();
    // non-exists
    const nonExistsResult = service.getFile('non-exists');
    expect(nonExistsResult).toBeNull();

    fileNames.push(txtFileName, jpgFileName);
  });

  // 应该正确获取静态文件
  it('should get static file correctly', async () => {
    // txt
    const { fileName: txtFileName } = await service.saveFileAsStatic(
      txtFile,
      'test.txt',
    );
    const txtResult = service.getStaticFile(txtFileName);
    expect(txtResult).not.toBeNull();
    // jpg
    const { fileName: jpgFileName } = await service.saveFileAsStatic(
      jpgFile,
      'test.jpg',
    );
    const jpgResult = service.getStaticFile(jpgFileName);
    expect(jpgResult).not.toBeNull();
    // non-exists
    const nonExistsResult = service.getStaticFile('non-exists');
    expect(nonExistsResult).toBeNull();

    staticFileNames.push(txtFileName, jpgFileName);
  });

  // 应该正确删除文件
  it('should delete file correctly', async () => {
    // txt
    const { fileName: txtFileName } = await service.saveFile(
      txtFile,
      'test.txt',
    );
    const txtResult = service.deleteFile(txtFileName);
    expect(txtResult).toBe(true);
    // jpg
    const { fileName: jpgFileName } = await service.saveFile(
      jpgFile,
      'test.jpg',
    );
    const jpgResult = service.deleteFile(jpgFileName);
    expect(jpgResult).toBe(true);
    // non-exists
    const nonExistsResult = service.deleteFile('non-exists');
    expect(nonExistsResult).toBe(true);
  });

  // 应该正确删除静态文件
  it('should delete static file correctly', async () => {
    // txt
    const { fileName: txtFileName } = await service.saveFileAsStatic(
      txtFile,
      'test.txt',
    );
    const txtResult = service.deleteStaticFile(txtFileName);
    expect(txtResult).toBe(true);
    // jpg
    const { fileName: jpgFileName } = await service.saveFileAsStatic(
      jpgFile,
      'test.jpg',
    );
    const jpgResult = service.deleteStaticFile(jpgFileName);
    expect(jpgResult).toBe(true);
    // non-exists
    const nonExistsResult = service.deleteStaticFile('non-exists');
    expect(nonExistsResult).toBe(true);
  });

  // 应该正确判断文件是否存在
  it('should check file exists correctly', async () => {
    // txt
    const { fileName: txtFileName } = await service.saveFile(
      txtFile,
      'test.txt',
    );
    const txtResult = service.isFileExists(txtFileName);
    expect(txtResult.exists).toBe(true);
    expect(txtResult.isStatic).toBe(false);
    // jpg
    const { fileName: jpgFileName } = await service.saveFileAsStatic(
      jpgFile,
      'test.jpg',
    );
    const jpgResult = service.isFileExists(jpgFileName);
    expect(jpgResult.exists).toBe(true);
    expect(jpgResult.isStatic).toBe(true);
    // non-exists
    const nonExistsResult = service.isFileExists('non-exists');
    expect(nonExistsResult.exists).toBe(false);
    expect(nonExistsResult.isStatic).toBe(false);

    fileNames.push(txtFileName);
    staticFileNames.push(jpgFileName);
  });

  // 不能通过非静态访问获取静态文件
  it('should not get static file by non-static access', async () => {
    const { fileName } = await service.saveFileAsStatic(jpgFile, 'test.jpg');
    const result = service.getFile(fileName);
    expect(result).toBeNull();

    staticFileNames.push(fileName);
  });

  // 不能通过静态访问获取非静态文件
  it('should not get non-static file by static access', async () => {
    const { fileName } = await service.saveFile(jpgFile, 'test.jpg');
    const result = service.getStaticFile(fileName);
    expect(result).toBeNull();

    fileNames.push(fileName);
  });
});
