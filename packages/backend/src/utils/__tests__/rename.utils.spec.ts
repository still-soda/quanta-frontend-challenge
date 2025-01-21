import { convertNameToUuid } from '../rename.utils';

describe('Rename Utils', () => {
  it('应该将名称中的文件名转换为uuid', () => {
    const originalName = 'file_name.jpg';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  it('应该将以 / 开头的路径转换为uuid', () => {
    const originalName = '/file_name.jpg';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  it('应该将包含文件名的路径转换为uuid', () => {
    const originalPath = '/path/to/file_name.jpg';
    const uuid = convertNameToUuid(originalPath);
    expect(uuid).not.toBe(originalPath);
    expect(uuid).toMatch(
      /^\/path\/to\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  it('应该将包含多个后缀的文件名转换为uuid', () => {
    const originalName = 'file_name.jpg.png';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg.png$/,
    );
  });

  it('应该将包含多个后缀的路径转换为uuid', () => {
    const originalPath = '/path/to/file_name.jpg.png';
    const uuid = convertNameToUuid(originalPath);
    expect(uuid).not.toBe(originalPath);
    expect(uuid).toMatch(
      /^\/path\/to\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg.png$/,
    );
  });

  it('应该将不带后缀的文件名转换为uuid', () => {
    const originalName = 'file_name';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/,
    );
  });

  it('应该将不带名字的文件名转化为uuid', () => {
    const originalName = '.jpg';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).not.toBe(originalName);
    expect(uuid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}.jpg$/,
    );
  });

  it('如果遇到空字符串，则应返回空字符串', () => {
    const originalName = '';
    const uuid = convertNameToUuid(originalName);
    expect(uuid).toBe('');
  });

  it('如果不是字符串，则应返回空字符串', () => {
    const originalName = 123;
    const uuid = convertNameToUuid(originalName as any);
    expect(uuid).toBe('');
  });
});
