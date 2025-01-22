import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * 这个函数是对 class-validator 的 validate 函数和 class-transformer 的
 * plainToInstance 函数的封装。
 *
 * 它接受一个类构造函数和一个对象，将对象转换为类的实例，然后使用 class-validator
 * 的 validate 函数验证实例的属性是否符合类的装饰器定义的规则。
 *
 * 如果验证失败，函数会抛出一个错误，错误的消息是验证失败的第一个属性的第一个错误
 * 的消息。如果不存在错误消息，会抛出 'Invalid value'。
 *
 * @param constructor 类构造函数
 * @param dto 对象
 * @returns 类的实例
 */
export default async function validateDto<Class extends object>(
  constructor: ClassConstructor<Class>,
  dto: Class,
): Promise<Class> {
  const dtoInstance = plainToInstance(constructor, dto, {
    excludeExtraneousValues: true,
  });
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const msg = Object.values(errors[0].constraints)?.[0];
    throw new Error(msg ?? 'Invalid value');
  }
  return dtoInstance;
}
