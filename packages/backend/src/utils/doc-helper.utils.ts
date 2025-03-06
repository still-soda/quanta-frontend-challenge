import { applyDecorators } from '@nestjs/common';

type Decorators = Array<ClassDecorator | MethodDecorator | PropertyDecorator>;

type DecoratorFactory<Options extends Record<string, any> = any> = (
  options?: Options,
) => Decorators;

/**
 * API 文档辅助工具类
 *
 * 用于简化 API 文档装饰器的使用，提供了更加直观的 API。
 */
export class ApiDocumentHelper<
  T extends Record<string, DecoratorFactory<any>>,
> {
  private decoratorsMap: T;

  /**
   * 构造 API 文档辅助工具类
   * @param decoratorsMap 装饰器工厂映射
   */
  constructor(decoratorsMap: T) {
    this.decoratorsMap = decoratorsMap;
  }

  /**
   * 为指定路由应用装饰器
   * @param route 路由名称
   * @param options 装饰器选项
   * @returns 装饰器
   * @throws 如果不存在指定路由对应的装饰器工厂
   */
  forRoute<Route extends keyof T>(
    route: Route,
    options?: Parameters<T[Route]>[0],
  ) {
    const factory = this.decoratorsMap[route];
    if (!factory) {
      throw new Error(`不存在指定路由 ${String(route)} 对应的装饰器工厂`);
    }
    return applyDecorators(...factory(options));
  }
}
