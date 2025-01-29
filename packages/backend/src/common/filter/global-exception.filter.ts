import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    this.logger.error(
      `[Status ${status}] When ${request.method} ${request.url} | ${message}`,
      exception.stack,
      GlobalExceptionFilter.name,
    );

    response.status(status).json({
      code: status,
      msg: message,
      timestamp: new Date().toISOString(),
    });
  }
}
