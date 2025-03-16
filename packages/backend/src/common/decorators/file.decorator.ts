import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { responseError } from '../../utils/http-response.utils';
import sharp from 'sharp';
import { MulterFile } from '../../modules/assets/assets.service';

/**
 * 使用 sharp 转换图片格式为 webp
 * @param file 文件
 */
async function sharpImage(file: MulterFile, callback: Function) {
  try {
    await sharp(file.buffer).webp({ quality: 0.75 }).toBuffer();
  } catch (error) {
    return callback(
      responseError('bad request', {
        msg: '图片转换失败',
      }),
      false,
    );
    return false;
  }

  file.mimetype = 'image/webp';
  file.originalname = file.originalname.replace(/\.\w+$/, '.webp');
  return true;
}

/**
 * 拦截文件上传的装饰器
 * @param name 文件字段名
 * @param maxMb 文件大小限制，单位 MB，默认 5MB
 * @param mimetypeLimit 文件类型限制，如 'image'，默认不限制
 */
export const UseFileInterceptor = (
  name: string,
  maxMb = 5,
  mimetypeLimit?: string,
) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(name, {
        storage: memoryStorage(),
        limits: {
          fileSize: maxMb * 1024 * 1024,
        },
        async fileFilter(_, file, callback) {
          if (mimetypeLimit && !file.mimetype.includes(mimetypeLimit)) {
            return callback(
              responseError('bad request', {
                msg: `非法的文件类型. 只能上传 ${mimetypeLimit} 类型的文件`,
              }),
              false,
            );
          }
          if (file.mimetype.includes('image')) {
            const success = await sharpImage(file, callback);
            if (!success) return;
          }
          callback(null, true);
        },
      }),
    ),
  );
};

/**
 * 拦截多文件上传的装饰器
 * @param options 配置
 */
export const UseFilesInterceptor = (options: {
  name: string;
  maxCount: number;
  maxMb?: number;
  mimetypeLimit?: string;
}) => {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(options.name, options.maxCount, {
        storage: memoryStorage(),
        limits: {
          fileSize: (options.maxMb || 5) * 1024 * 1024,
        },
        async fileFilter(_, file, callback) {
          if (
            options.mimetypeLimit &&
            !file.mimetype.includes(options.mimetypeLimit)
          ) {
            return callback(
              responseError('bad request', {
                msg: `非法的文件类型. 只能上传 ${options.mimetypeLimit} 类型的文件`,
              }),
              false,
            );
          }
          if (file.mimetype.includes('image')) {
            const success = await sharpImage(file, callback);
            if (!success) return;
          }
          callback(null, true);
        },
      }),
    ),
  );
};
