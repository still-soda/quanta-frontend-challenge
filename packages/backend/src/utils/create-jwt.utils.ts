import { JwtModule } from '@nestjs/jwt';

export function createJwtModule() {
  return JwtModule.register({
    global: true,
    secret:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVzdF90ZXN0IiwiYWRtaW4iOmZhbHNlLCJpc3MiOiJ0ZXN0aW5nIn0._8WM07tcroP_TY2xK4QW3OiAhElPaEUQp_zXTPRGenKMqjyfkjL4Oh4pJphhUy9NjXoOg8nYYSN_32OSCJpvNg',
    signOptions: { expiresIn: '1d' },
  });
}
