const AuthLayout = () => import('@/views/auth/layout.vue');
const Login = () => import('@/views/auth/login/index.vue');

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
   ],
};
