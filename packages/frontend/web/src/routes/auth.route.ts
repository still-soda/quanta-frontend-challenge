const AuthLayout = () => import('@/views/auth/layout.vue');
const Login = () => import('@/views/auth/login/index.vue');
const Register = () => import('@/views/auth/register/index.vue');

export default {
   path: '/auth/',
   name: 'Auth',
   component: AuthLayout,
   redirect: '/auth/login',
   children: [
      {
         path: 'login',
         name: 'Login',
         component: Login,
         meta: { deynamiceTitle: '登录' },
      },
      {
         path: 'register',
         name: 'Register',
         component: Register,
         meta: { deynamiceTitle: '注册' },
      },
      {
         path: 'forget-password',
         name: 'ForgetPassword',
         component: () => import('@/views/auth/forget-password/index.vue'),
         meta: { deynamiceTitle: '忘记密码' },
      },
   ],
};
