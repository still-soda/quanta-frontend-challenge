import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { convertNameToUuid } from '../../utils/rename.utils';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Assets, AssetsDocument } from '../../schemas/assets.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MimeType } from './mime-type.type';

@Injectable()
export class AssetsService {
  private readonly FILE_ROOT: string;
  private readonly STATIC_ROOT: string;

  constructor(
    @InjectModel(Assets.name)
    private readonly assetsModel: Model<AssetsDocument>,
    private readonly configService: ConfigService,
  ) {
    this.FILE_ROOT = this.configService.get('FILE_ROOT');
    this.STATIC_ROOT = this.configService.get('STATIC_ROOT');
  }

  /**
   * 如果目录不存在的话创建目录
   * @param dir 目录路径
   */
  async createDirectoryIfNotExists(dir: string) {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  /**
   * 获取指定 mimeType 的文件元数据列表，可以通过 filter 参数进行过滤：
   * - `only`: 只获取静态文件或非静态文件的元数据
   * - `count`: 获取的元数据数量，默认为 100
   * - `skip`: 跳过的元数据数量，默认为 0
   *
   * @param mimeType 文件类型
   * @param filter 过滤参数
   * @returns 文件元数据列表
   */
  async getFileMatadataListByMimeType(
    mimeType: MimeType,
    filter?: {
      only?: 'static' | 'non-static';
      count?: number;
      skip?: number;
    },
  ) {
    const { only, count = 100, skip = 0 } = filter ?? {};
    const query = only
      ? { mimeType, isStatic: only === 'static' }
      : { mimeType };
    const assets = await this.assetsModel.find(query).skip(skip).limit(count);
    return assets;
  }

  /**
   * 保存文本为非静态文件。内部会将文件名转换为 UUID
   * @param options
   * - `content`: 文件内容
   * - `name`: 文件名
   * - `mimeType`: 文件类型
   * @returns 保存结果
   * - `ok`: 是否保存成功
   * - `fileName`: 保存后的文件名
   * - `id`: 文件元数据 Id
   */
  async saveTextFile(options: {
    content: string;
    name: string;
    mimeType: MimeType;
  }) {
    const { content, name, mimeType } = options;

    if (content === '' || !content) {
      return { ok: false, fileName: '' };
    }

    const fileName = convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, content);
      const { id } = await this.assetsModel.create({
        name: name,
        localName: fileName,
        mimeType: mimeType,
        isStatic: false,
      });
      return { ok: true, fileName, id };
    } catch (error) {
      console.error(error, content);
      return { ok: false, fileName: '', id: '' };
    }
  }

  /**
   * 保存文本为静态文件。内部会将文件名转换为 UUID
   * @param options
   * - `content`: 文件内容
   * - `name`: 文件名
   * - `mimeType`: 文件类型
   * @returns
   * - `ok`: 是否保存成功
   * - `fileName`: 保存后的文件名
   * - `id`: 文件元数据 Id
   */
  async saveTextFileAsStatic(options: {
    content: string;
    name: string;
    mimeType: MimeType;
  }) {
    const { content, name, mimeType } = options;

    if (content === '' || !content) {
      return { ok: false, fileName: '' };
    }

    const fileName = convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, content);
      const { id } = await this.assetsModel.create({
        name: name,
        localName: fileName,
        mimeType: mimeType,
        isStatic: true,
      });
      return { ok: true, fileName, id };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '', id: '' };
    }
  }

  /**
   * 保存文件为非静态文件。内部会将文件名转换为 UUID
   * @param options
   * - `file`: 文件，可以是 Buffer 或者 File 对象
   * - `name`: 文件名
   * - `mimeType`: 文件类型
   * @returns
   * - `ok`: 是否保存成功
   * - `fileName`: 保存后的文件名
   */
  async saveFile(options: {
    file: File | Buffer;
    name: string;
    mimeType: MimeType;
  }) {
    const { file, name, mimeType } = options;

    const fileName = convertNameToUuid(name);
    const buffer =
      file instanceof Buffer
        ? file
        : new Uint8Array(await (file as File).arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, buffer);
      const { id } = await this.assetsModel.create({
        localName: fileName,
        name: name,
        mimeType: mimeType,
        isStatic: false,
      });
      return { ok: true, fileName, id };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '', id: '' };
    }
  }

  /**
   * 保存文件为静态文件。内部会将文件名转换为 UUID
   * @param options
   * - `file`: 文件，可以是 Buffer 或者 File 对象
   * - `name`: 文件名
   * - `mimeType`: 文件类型
   * @returns
   * - `ok`: 是否保存成功
   * - `fileName`: 保存后的文件名
   * - `id`: 文件元数据 Id
   */
  async saveFileAsStatic(options: {
    file: File | Buffer;
    name: string;
    mimeType: MimeType;
  }) {
    const { file, name, mimeType } = options;

    const fileName = convertNameToUuid(name);
    const buffer =
      file instanceof Buffer
        ? file
        : new Uint8Array(await (file as File).arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, buffer);
      const { id } = await this.assetsModel.create({
        localName: fileName,
        name: name,
        mimeType: mimeType,
        isStatic: true,
      });
      return { ok: true, fileName, id };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '', id: '' };
    }
  }

  /**
   * 根据文件名获取文件元数据
   * @param fileName 文件名
   * @returns  文件元数据
   */
  async getFileMetadataByName(
    fileName: string,
  ): Promise<AssetsDocument | null> {
    const asset = await this.assetsModel.findOne({ localName: fileName });
    return asset;
  }

  /**
   * 根据文件元数据 Id 获取文件元数据
   * @param id 文件元数据 Id
   * @returns 文件元数据
   */
  async getFileMetadataById(id: string): Promise<AssetsDocument | null> {
    const assets = await this.assetsModel.findOne({ _id: id });
    return assets;
  }

  /**
   * 获取文件数据（Buffer），如果文件不存在或者是静态文件则返回 null
   * @param fileName 文件名
   * @returns 文件数据
   */
  async getFileByName(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || metadata.isStatic) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${this.FILE_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 获取文件数据（Buffer），如果文件不存在或者是静态文件则返回 null
   * @param id 文件元数据 Id
   * @returns 文件数据
   */
  async getFileById(id: string) {
    const metadata = await this.getFileMetadataById(id);
    if (!metadata || metadata.isStatic) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${this.FILE_ROOT}/${metadata.localName}`);
      return buffer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 获取静态文件数据（Buffer），如果文件不存在或者不是静态文件则返回 null
   * @param fileName 文件名
   * @returns 文件数据
   */
  async getStaticFile(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || !metadata.isStatic) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${this.STATIC_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 获取静态文件数据（Buffer），如果文件不存在或者不是静态文件则返回 null
   * @param id 文件元数据 Id
   * @returns 文件数据
   */
  async getStaticFileById(id: string) {
    const metadata = await this.getFileMetadataById(id);
    if (!metadata || !metadata.isStatic) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(
        `${this.STATIC_ROOT}/${metadata.localName}`,
      );
      return buffer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 读取文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param fileName 文件名
   * @returns 文件内容
   */
  async readTextFile(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || metadata.isStatic) {
      return '';
    }

    try {
      const content = fs.readFileSync(`${this.FILE_ROOT}/${fileName}`, 'utf-8');
      return content;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * 读取文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param id 文件元数据 Id
   * @returns 文件内容
   */
  async readTextFileById(id: string) {
    const metadata = await this.getFileMetadataById(id);
    if (!metadata || metadata.isStatic) {
      return '';
    }

    try {
      const content = fs.readFileSync(
        `${this.FILE_ROOT}/${metadata.localName}`,
        'utf-8',
      );
      return content;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * 读取静态文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param fileName 文件名
   * @returns 文件内容
   */
  async readStaticTextFile(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || !metadata.isStatic) {
      return '';
    }

    try {
      const content = fs.readFileSync(
        `${this.STATIC_ROOT}/${fileName}`,
        'utf-8',
      );
      return content;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * 读取静态文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param id 文件元数据 Id
   * @returns 文件内容
   */
  async readStaticTextFileById(id: string) {
    const metadata = await this.getFileMetadataById(id);
    if (!metadata || !metadata.isStatic) {
      return '';
    }

    try {
      const content = fs.readFileSync(
        `${this.STATIC_ROOT}/${metadata.localName}`,
        'utf-8',
      );
      return content;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * 删除文件，如果文件不存在或者是静态文件则返回 true
   * @param fileName 文件名
   * @returns  是否删除成功
   */
  async deleteFile(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || metadata.isStatic) {
      return true;
    }

    try {
      await this.assetsModel.deleteOne({ _id: metadata._id });
      fs.unlinkSync(`${this.FILE_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 删除静态文件，如果文件不存在或者不是静态文件则返回 true
   * @param fileName 文件名
   * @returns 是否删除成功
   */
  async deleteStaticFile(fileName: string) {
    const metadata = await this.getFileMetadataByName(fileName);
    if (!metadata || !metadata.isStatic) {
      return true;
    }

    try {
      await this.assetsModel.deleteOne({ _id: metadata._id });
      fs.unlinkSync(`${this.STATIC_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 判断文件是否存在
   * @param options
   * - `fileName`: 文件名
   * - `id`: 文件元数据 Id
   * @returns 是否存在
   */
  async isFileExists(options: { fileName?: string; id?: string }) {
    const { fileName, id } = options;
    if (!fileName && !id) {
      throw new Error('fileName 和 id 不能同时为空');
    }
    const metadata = fileName
      ? await this.getFileMetadataByName(fileName)
      : await this.getFileMetadataById(id);
    const exists = !!metadata;
    const isStatic = metadata?.isStatic ?? false;

    return { exists, isStatic };
  }
}
