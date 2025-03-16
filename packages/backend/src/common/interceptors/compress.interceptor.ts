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
    return await sharp(file.buffer).webp({ quality: 0.75 }).toBuffer();
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
  constructor(imageName: string) {
    this.imageName = imageName;
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const image: MulterFile | undefined = request[this.imageName];

    if (image) {
      image.buffer = await sharpImage(image);
      image.size = image.buffer.length;
    }

    return next.handle();
  }
}
