import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { convertNameToUuid } from '../../utils/rename.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssetsService {
  private readonly FILE_ROOT: string;
  private readonly STATIC_ROOT: string;

  constructor(private readonly configService: ConfigService) {
    this.FILE_ROOT = this.configService.get('FILE_ROOT');
    this.STATIC_ROOT = this.configService.get('STATIC_ROOT');
  }

  async createDirectoryIfNotExists(dir: string) {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  async saveTextFile(content: string, name: string) {
    if (content === '') {
      return { ok: false, fileName: '' };
    }

    const fileName = convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, content);
      return { ok: true, fileName };
    } catch (error) {
      console.log(error);
      return { ok: false, fileName: '' };
    }
  }

  async saveTextFileAsStatic(content: string, name: string) {
    if (content === '') {
      return { ok: false, fileName: '' };
    }

    const fileName = convertNameToUuid(name);
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, content);
      return { ok: true, fileName };
    } catch (error) {
      console.log(error);
      return { ok: false, fileName: '' };
    }
  }

  async saveFile(file: File, name: string) {
    const fileName = convertNameToUuid(name);
    const buffer = new Uint8Array(await file.arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.FILE_ROOT);
      fs.writeFileSync(`${this.FILE_ROOT}/${fileName}`, buffer);
      return { ok: true, fileName };
    } catch (error) {
      console.log(error);
      return { ok: false, fileName: '' };
    }
  }

  async saveFileAsStatic(file: File, name: string) {
    const fileName = convertNameToUuid(name);
    const buffer = new Uint8Array(await file.arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(this.STATIC_ROOT);
      fs.writeFileSync(`${this.STATIC_ROOT}/${fileName}`, buffer);
      return { ok: true, fileName };
    } catch (error) {
      console.log(error);
      return { ok: false, fileName: '' };
    }
  }

  getFile(fileName: string) {
    if (!fs.existsSync(`${this.FILE_ROOT}/${fileName}`)) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${this.FILE_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getStaticFile(fileName: string) {
    if (!fs.existsSync(`${this.STATIC_ROOT}/${fileName}`)) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${this.STATIC_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  readTextFile(fileName: string) {
    if (!fs.existsSync(`${this.FILE_ROOT}/${fileName}`)) {
      return '';
    }

    try {
      const content = fs.readFileSync(`${this.FILE_ROOT}/${fileName}`, 'utf-8');
      return content;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  readStaticTextFile(fileName: string) {
    if (!fs.existsSync(`${this.STATIC_ROOT}/${fileName}`)) {
      return '';
    }

    try {
      const content = fs.readFileSync(
        `${this.STATIC_ROOT}/${fileName}`,
        'utf-8',
      );
      return content;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  deleteFile(fileName: string) {
    if (!fs.existsSync(`${this.FILE_ROOT}/${fileName}`)) {
      return true;
    }

    try {
      fs.unlinkSync(`${this.FILE_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteStaticFile(fileName: string) {
    if (!fs.existsSync(`${this.STATIC_ROOT}/${fileName}`)) {
      return true;
    }

    try {
      fs.unlinkSync(`${this.STATIC_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  isFileExists(fileName: string) {
    let exists = false;
    let isStatic = false;

    if (fs.existsSync(`${this.FILE_ROOT}/${fileName}`)) {
      exists = true;
    } else if (fs.existsSync(`${this.STATIC_ROOT}/${fileName}`)) {
      exists = true;
      isStatic = true;
    }

    return { exists, isStatic };
  }
}
