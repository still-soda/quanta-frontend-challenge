/**
 * 将文件名转换为 UUID
 * @param name 文件名
 * @example
 * ```ts
 * convertNameToUuid('file_name.jpg');          // 'file_name.jpg' -> 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx.jpg'
 * convertNameToUuid('/file_name.jpg');         // '/file_name.jpg' -> 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx.jpg'
 * convertNameToUuid('file_name.jpg.png');      // 'file_name.jpg.png' -> 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx.jpg.png'
 * convertNameToUuid('/path/to/file_name.jpg'); // '/path/to/file_name.jpg' -> '/path/to/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx.jpg'
 * convertNameToUuid('');                       // '' -> ''
 * convertNameToUuid(123);                      // 123 -> ''
 * ```
 */
export function convertNameToUuid(name: string): string {
  if (typeof name !== 'string' || name === '') {
    return '';
  }

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  const parts = name.split('.');
  if (parts.length === 0) {
    return uuid;
  } else {
    const extension = parts.shift();
    const suffix = parts.join('.');
    const dir = extension.split('/').slice(0, -1).join('/');

    return `${dir}${dir === '' ? '' : '/'}${uuid}${suffix === '' ? '' : '.'}${suffix}`;
  }
}
