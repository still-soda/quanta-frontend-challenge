import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * 过滤数据，相当于 `validateData` 的无验证版本。
 *
 * 只有用 `class-transformer` 中的 `@Expose()` 标注的属性才会得以保留。
 *
 * @param constructor
 * @param dto
 * @returns
 */
export function filterData<Class extends object>(
  constructor: ClassConstructor<Class>,
  dto: Class,
) {
  return plainToInstance(constructor, dto, { excludeExtraneousValues: true });
}
