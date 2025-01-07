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
