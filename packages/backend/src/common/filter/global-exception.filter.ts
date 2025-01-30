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

    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';
    const requestInfo =
      '[Info] body: ' +
      JSON.stringify(request.body) +
      ' | query: ' +
      JSON.stringify(request.query) +
      ' | params: ' +
      JSON.stringify(request.params);

    this.logger.error(
      `[Status ${status}] When ${request.method} ${request.url} | ${message}`,
      requestInfo,
      exception.stack,
    );

    response.status(status).json({
      code: status,
      msg: message,
      timestamp: new Date().toISOString(),
    });
  }
}
