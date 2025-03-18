import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import sharp from 'sharp';
import { MulterFile } from '../../modules/assets/assets.service';
import { responseError } from '../../utils/http-response.utils';

/**
 * 使用 sharp 转换图片格式为 webp
 * @param file 文件
 */
async function sharpImage(file: MulterFile) {
  try {
    file.mimetype = 'image/webp';
    file.originalname = file.originalname.replace(/\.\w+$/, '.webp');
    return await sharp(file.buffer).webp({ quality: 75 }).toBuffer();
  } catch (error) {
    throw responseError('bad request', {
      msg: '图片转换失败: ' + error.message,
    });
  }
}

/**
 * 图片压缩拦截器，使用 sharp 压缩图片
 */
export class ImageCompressInterceptor implements NestInterceptor {
  private readonly imageName: string;
  private readonly enable: boolean;
  constructor(imageName: string, enable: boolean = true) {
    this.imageName = imageName;
    this.enable = enable;
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    if (!this.enable) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    let files: MulterFile | MulterFile[] | undefined = request[this.imageName];

    files && !Array.isArray(files) && (files = [files]);
    if (Array.isArray(files) && files[0].mimetype.startsWith('image')) {
      const sharpBuffer = await Promise.all(
        files.map(async (file) => sharpImage(file)),
      );
      for (let i = 0; i < files.length; i++) {
        files[i].buffer = sharpBuffer[i];
        files[i].size = sharpBuffer[i].length;
      }
    }

    return next.handle();
  }
}
