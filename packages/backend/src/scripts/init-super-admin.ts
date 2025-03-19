import { ROLE } from 'src/common/decorators/auth.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { INestApplication } from '@nestjs/common';

async function initSuperAdmin(app: INestApplication) {
  // 运行初始化脚本
  const userService = app.get(UsersService);
  const authService = app.get(AuthService);
  let superAdmin = await userService.findOneByUsername('super-admin');

  if (!superAdmin) {
    // 创建超级管理员
    await authService.register({
      username: 'super-admin',
      password: '123456',
      email: 'superadmin@quanta.com',
      number: '20231003059',
    });
    // 提权
    superAdmin = await userService.findOneByUsername('super-admin');
    await userService.update(superAdmin._id.toString() as string, {
      role: ROLE.SUPER_ADMIN,
    });

    console.log('Super admin created!');
  }
}

export default initSuperAdmin;
