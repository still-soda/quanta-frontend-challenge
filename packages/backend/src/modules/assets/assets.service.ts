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
   * - only: 只获取静态文件或非静态文件
   * - count: 获取的文件数量，默认为 100
   * - skip: 跳过的文件数量，默认为 0
   *
   * @param mimeType 文件类型
   * @param filter 过滤参数
   * @returns 文件名列表
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
    const assets = await this.assetsModel
      .find({
        mimeType,
        isStatic: only === undefined ? undefined : only === 'static',
      })
      .skip(skip)
      .limit(count);
    return assets.map((asset) => asset.name);
  }

  /**
   * 保存文本为非静态文件。内部会将文件名转换为 UUID
   * （可以通过设置 `dontRename` 为 `true` 阻止）
   *
   * @param options
   * - content: 文件内容
   * - name: 文件名
   * - mimeType: 文件类型
   * - dontRename: 是否重命名文件，默认为 false
   * @returns 保存结果
   * - ok: 是否保存成功
   * - fileName: 保存后的文件名
   */
  async saveTextFile(options: {
    content: string;
    name: string;
    dontRename?: boolean;
    mimeType: MimeType;
  }) {
    const { content, name, mimeType, dontRename = false } = options;

    if (content === '' || !content) {
      return { ok: false, fileName: '' };
    }

    const fileName = dontRename ? name : convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, content);
      await this.assetsModel.create({
        name: fileName,
        mimeType: mimeType,
        isStatic: false,
      });
      return { ok: true, fileName };
    } catch (error) {
      console.error(error, content);
      return { ok: false, fileName: '' };
    }
  }

  /**
   * 保存文本为静态文件。内部会将文件名转换为 UUID
   * （可以通过设置 `dontRename` 为 `true` 阻止）
   *
   * @param options
   * - content: 文件内容
   * - name: 文件名
   * - mimeType: 文件类型
   * - dontRename: 是否重命名文件，默认为 false
   * @returns
   * - ok: 是否保存成功
   * - fileName: 保存后的文件名
   */
  async saveTextFileAsStatic(options: {
    content: string;
    name: string;
    mimeType: MimeType;
    dontRename?: boolean;
  }) {
    const { content, name, mimeType, dontRename = false } = options;

    if (content === '' || !content) {
      return { ok: false, fileName: '' };
    }

    const fileName = dontRename ? name : convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, content);
      await this.assetsModel.create({
        name: fileName,
        mimeType: mimeType,
        isStatic: true,
      });
      return { ok: true, fileName };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '' };
    }
  }

  /**
   * 保存文件为非静态文件。内部会将文件名转换为 UUID
   * （可以通过设置 `dontRename` 为 `true` 阻止）
   *
   * @param options
   * - file: 文件，可以是 Buffer 或者 File 对象
   * - name: 文件名
   * - mimeType: 文件类型
   * - dontRename: 是否重命名文件，默认为 false
   * @returns
   * - ok: 是否保存成功
   * - fileName: 保存后的文件名
   */
  async saveFile(options: {
    file: File | Buffer;
    name: string;
    mimeType: MimeType;
    dontRename?: boolean;
  }) {
    const { file, name, mimeType, dontRename = false } = options;

    const fileName = dontRename ? name : convertNameToUuid(name);
    const buffer =
      file instanceof Buffer
        ? file
        : new Uint8Array(await (file as File).arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, buffer);
      await this.assetsModel.create({
        name: fileName,
        mimeType: mimeType,
        isStatic: false,
      });
      return { ok: true, fileName };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '' };
    }
  }

  /**
   * 保存文件为静态文件。内部会将文件名转换为 UUID
   * （可以通过设置 `dontRename` 为 `true` 阻止）
   *
   * @param options
   * - file: 文件，可以是 Buffer 或者 File 对象
   * - name: 文件名
   * - mimeType: 文件类型
   * - dontRename: 是否重命名文件，默认为 false
   * @returns
   * - ok: 是否保存成功
   * - fileName: 保存后的文件名
   */
  async saveFileAsStatic(options: {
    file: File | Buffer;
    name: string;
    mimeType: MimeType;
    dontRename?: boolean;
  }) {
    const { file, name, mimeType, dontRename = false } = options;

    const fileName = dontRename ? name : convertNameToUuid(name);
    const buffer =
      file instanceof Buffer
        ? file
        : new Uint8Array(await (file as File).arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, buffer);
      await this.assetsModel.create({
        name: fileName,
        mimeType: mimeType,
        isStatic: true,
      });
      return { ok: true, fileName };
    } catch (error) {
      console.error(error);
      return { ok: false, fileName: '' };
    }
  }

  /**
   * 获取文件元数据
   * @param fileName 文件名
   * @returns  文件元数据
   */
  async getFileMetadata(fileName: string) {
    const asset = await this.assetsModel.findOne({ name: fileName });
    return asset;
  }

  /**
   * 获取文件数据（Buffer），如果文件不存在或者是静态文件则返回 null
   * @param fileName 文件名
   * @returns 文件数据
   */
  async getFile(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
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
   * 获取静态文件数据（Buffer），如果文件不存在或者不是静态文件则返回 null
   * @param fileName 文件名
   * @returns 文件数据
   */
  async getStaticFile(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
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
   * 读取文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param fileName 文件名
   * @returns 文件内容
   */
  async readTextFile(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
    if (
      !metadata ||
      metadata.isStatic ||
      !metadata.mimeType.startsWith('text')
    ) {
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
   * 读取静态文本文件内容，如果文件不存在或者不是文本文件则返回空字符串
   * @param fileName 文件名
   * @returns 文件内容
   */
  async readStaticTextFile(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
    if (
      !metadata ||
      !metadata.isStatic ||
      !metadata.mimeType.startsWith('text')
    ) {
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
   * 删除文件，如果文件不存在或者是静态文件则返回 true
   * @param fileName 文件名
   * @returns  是否删除成功
   */
  async deleteFile(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
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
    const metadata = await this.getFileMetadata(fileName);
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
   * @param fileName 文件名
   * @returns 是否存在
   */
  async isFileExists(fileName: string) {
    const metadata = await this.getFileMetadata(fileName);
    const exists = !!metadata;
    const isStatic = metadata?.isStatic ?? false;

    return { exists, isStatic };
  }
}
