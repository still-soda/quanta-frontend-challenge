import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

/**
 * 全局异常过滤器
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception?.getStatus?.() || 500;
    const message = exception?.message || 'Internal server error';
    const ip = request.headers['x-real-ip'] || request.ip;
    const token = request.headers['authorization'];

    const info = {
      status: status,
      method: request.method,
      url: request.url,
      ip: ip,
      token: token,
      body: request.body,
      query: request.query,
      params: request.params,
      message: message,
    };

    const optionalParams = [];
    const withStack = !exception?.getResponse?.()?.__without_stack__;
    withStack && optionalParams.push(exception.stack);

    this.logger.error(JSON.stringify(info), ...optionalParams);

    response.status(status).json({
      code: status,
      message: message,
    });
  }
}
