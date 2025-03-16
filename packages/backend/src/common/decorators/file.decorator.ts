import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { responseError } from '../../utils/http-response.utils';
import sharp from 'sharp';
import { MulterFile } from '../../modules/assets/assets.service';
import { ImageCompressInterceptor } from '../interceptors/compress.interceptor';

/**
 * 拦截文件上传的装饰器
 * @param name 文件字段名
 * @param maxMb 文件大小限制，单位 MB，默认 5MB
 * @param mimetypeLimit 文件类型限制，如 'image'，默认不限制
 * @param enableCompress 是否启用压缩，默认 true
 */
export const UseFileInterceptor = (
  name: string,
  maxMb = 5,
  mimetypeLimit?: string,
  enableCompress = true,
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
          callback(null, true);
        },
      }),
      new ImageCompressInterceptor(name, enableCompress),
    ),
  );
};

/**
 * 拦截多文件上传的装饰器
 * @param options 配置
 * - `name` 文件字段名
 * - `maxCount` 最大文件数量
 * - `maxMb` 文件大小限制，单位 MB，默认 5MB
 * - `mimetypeLimit` 文件类型限制，如 'image'，默认不限制
 * - `enableCompress` 是否启用压缩，默认 true
 */
export const UseFilesInterceptor = (options: {
  name: string;
  maxCount: number;
  maxMb?: number;
  mimetypeLimit?: string;
  enableCompress?: boolean;
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
          callback(null, true);
        },
      }),
      new ImageCompressInterceptor(
        options.name,
        options.enableCompress ?? true,
      ),
    ),
  );
};
