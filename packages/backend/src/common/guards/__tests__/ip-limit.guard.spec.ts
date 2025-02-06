import { IpLimitGuard } from '../ip-limit.guard';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ExecutionContext } from '@nestjs/common';

const configService = {
  get: jest.fn().mockReturnValue(10),
} as any as ConfigService;

const cachesService = {
  incr: jest.fn(),
  expire: jest.fn(),
};

const reflector = {
  get: jest.fn(),
};

describe('IpLimitGuard', () => {
  let ipLimitGuard: IpLimitGuard;

  beforeAll(async () => {
    ipLimitGuard = new IpLimitGuard(
      configService,
      cachesService as any,
      reflector as any,
    );
  });

  it('应该正确拦截请求（请求过于频繁）', async () => {
    const request = { headers: { 'x-real-ip': '127.1.1.1' } } as any as Request;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => null,
    } as any as ExecutionContext;

    reflector.get.mockReturnValueOnce(0);
    cachesService.incr.mockResolvedValueOnce(11);

    await expect(ipLimitGuard.canActivate(context)).rejects.toThrow(
      '请求过于频繁，请稍后再试',
    );
  });

  it('应该正确拦截请求（无法获取 IP 地址）', async () => {
    const request = {} as any as Request;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => null,
    } as any as ExecutionContext;

    reflector.get.mockReturnValueOnce(0);

    await expect(ipLimitGuard.canActivate(context)).rejects.toThrow(
      '无法获取 IP 地址',
    );
  });

  it('无需限制 IP 时应该放行', async () => {
    const request = {} as any as Request;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => null,
    } as any as ExecutionContext;

    reflector.get.mockReturnValueOnce(undefined);

    await expect(ipLimitGuard.canActivate(context)).resolves.toBe(true);
  });

  it('合理请求应该放行', async () => {
    const request = { headers: { 'x-real-ip': '127.1.1.1' } } as any as Request;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => null,
    } as any as ExecutionContext;

    reflector.get.mockReturnValueOnce(0);
    cachesService.incr.mockResolvedValueOnce(1);

    await expect(ipLimitGuard.canActivate(context)).resolves.toBe(true);
  });
});
