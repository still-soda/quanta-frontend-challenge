import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

/**
 * 拦截文件上传的装饰器
 * @param name 文件字段名
 * @param maxMb 文件大小限制，单位 MB，默认 5MB
 * @param mimetypeLimit 文件类型限制，如 'image'，默认不限制
 */
export const UseFileInceptor = (
  name: string,
  maxMb = 10,
  mimetypeLimit?: string,
) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(name, {
        storage: memoryStorage(),
        limits: {
          fileSize: maxMb * 1024 * 1024,
        },
        fileFilter(_, file, callback) {
          if (mimetypeLimit && !file.mimetype.includes(mimetypeLimit)) {
            return callback(
              new Error(`非法的文件类型. 只能上传 ${mimetypeLimit} 类型的文件`),
              false,
            );
          }
          callback(null, true);
        },
      }),
    ),
  );
};
