/**
 * 这个函数返回一个正则表达式，用于匹配以 UUID 为前缀的文件名。
 * @param suffix 文件名的后缀
 * @returns 一个正则表达式
 */
export function uuidFileNameRegEndWith(suffix: string): RegExp {
  return new RegExp(
    `^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}${suffix}$`,
  );
}
