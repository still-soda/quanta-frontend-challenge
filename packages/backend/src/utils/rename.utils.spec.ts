import { convertNameToUuid } from './rename.utils';

describe('Rename Utils', () => {
  // 应该将名称中的文件名转换为uuid
  it('should convert file name to uuid', () => {
    const originalName = 'file_name.jpg';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  // 应该将以 / 开头的路径转换为uuid
  it('should convert path starting with "/" to uuid', () => {
    const originalName = '/file_name.jpg';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  // 应该将包含文件名的路径转换为uuid
  it('should convert path containing file name to uuid', () => {
    const originalPath = '/path/to/file_name.jpg';
    const uuid = convertNameToUuid(originalPath);
    expect(uuid).not.toBe(originalPath);
    expect(uuid).toMatch(
      /^\/path\/to\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  // 应该将包含多个后缀的文件名转换为uuid
  it('should convert file name containing multiple extensions to uuid', () => {
    const originalName = 'file_name.jpg.png';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg.png$/,
    );
  });

  // 应该将包含多个后缀的路径转换为uuid
  it('should convert path containing multiple extensions to uuid', () => {
    const originalPath = '/path/to/file_name.jpg.png';
    const uuid = convertNameToUuid(originalPath);
    expect(uuid).not.toBe(originalPath);
    expect(uuid).toMatch(
      /^\/path\/to\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg.png$/,
    );
  });

  // 应该将不带后缀的文件名转换为uuid
  it('should convert file name without extension to uuid', () => {
    const originalName = 'file_name';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/,
    );
  });

  // 如果遇到空字符串，则应返回空字符串
  it('should return empty string if empty string is encountered', () => {
    const originalName = '';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).toBe('');
  });

  // 如果不是字符串，则应返回空字符串
  it('should return empty string if not a string', () => {
    const originalName = 123;
    const uuid = convertNameToUuid(originalName as any);
    expect(uuid).toBe('');
  });
});
