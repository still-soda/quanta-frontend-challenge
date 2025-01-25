import { uuidFileNameRegEndWith } from '../testing.utils';

describe('fn: uuidFileNameRegEndWith', () => {
  it.each([
    ['123e4567-e89b-42d3-a456-426614174000.html', true],
    ['123e4567-e89b-42d3-a456-426614174000.jpg', false],
    ['123e4567-e89b-42d3-a456-426614174000', false],
  ])('应该正确匹配以 UUID 为前缀的文件名（%s -> %s）', (fileName, expected) => {
    const reg = uuidFileNameRegEndWith('.html');
    expect(reg.test(fileName)).toBe(expected);
  });
});
