import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { convertNameToUuid } from '../../utils/rename.utils';

const FILE_ROOT = './assets/uploads';
const STATIC_ROOT = './assets/static';

@Injectable()
export class AssetsService {
  async createDirectoryIfNotExists(dir: string) {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  async saveFile(file: File, name: string) {
    const fileName = convertNameToUuid(name);
    const buffer = new Uint8Array(await file.arrayBuffer());
    try {
      await this.createDirectoryIfNotExists(FILE_ROOT);
      fs.writeFileSync(`${FILE_ROOT}/${fileName}`, buffer);
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
      await this.createDirectoryIfNotExists(STATIC_ROOT);
      fs.writeFileSync(`${STATIC_ROOT}/${fileName}`, buffer);
      return { ok: true, fileName };
    } catch (error) {
      console.log(error);
      return { ok: false, fileName: '' };
    }
  }

  getFile(fileName: string) {
    if (!fs.existsSync(`${FILE_ROOT}/${fileName}`)) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${FILE_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getStaticFile(fileName: string) {
    if (!fs.existsSync(`${STATIC_ROOT}/${fileName}`)) {
      return null;
    }

    try {
      const buffer = fs.readFileSync(`${STATIC_ROOT}/${fileName}`);
      return buffer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  deleteFile(fileName: string) {
    if (!fs.existsSync(`${FILE_ROOT}/${fileName}`)) {
      return true;
    }

    try {
      fs.unlinkSync(`${FILE_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteStaticFile(fileName: string) {
    if (!fs.existsSync(`${STATIC_ROOT}/${fileName}`)) {
      return true;
    }

    try {
      fs.unlinkSync(`${STATIC_ROOT}/${fileName}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  isFileExists(fileName: string) {
    let exists = false;
    let isStatic = false;

    if (fs.existsSync(`${FILE_ROOT}/${fileName}`)) {
      exists = true;
    } else if (fs.existsSync(`${STATIC_ROOT}/${fileName}`)) {
      exists = true;
      isStatic = true;
    }

    return { exists, isStatic };
  }
}
