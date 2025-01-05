const Dashboard = () => import('@/views/app/dashboard/index.vue');
const Rank = () => import('@/views/app/rank/index.vue');
const Profile = () => import('@/views/app/profile/index.vue');
const Challenge = () => import('@/views/app/challenge/index.vue');
const ChallengeDetail = () => import('@/views/app/challenge/detail/index.vue');
const Notification = () => import('@/views/app/notification/index.vue');
const NotificationDetail = () =>
   import('@/views/app/notification/detail/index.vue');
const Error404 = () => import('@/views/app/error/404/index.vue');

const AppLayout = () => import('@/views/app/layout.vue');

export default {
   path: '/',
   name: 'App',
   component: AppLayout,
   redirect: '/dashboard',
   children: [
      {
         path: 'dashboard',
         name: 'Dashboard',
         component: Dashboard,
         meta: { deynamiceTitle: '首页' },
      },
      {
         path: 'rank',
         name: 'Rank',
         component: Rank,
         meta: { deynamiceTitle: '排行' },
      },
      {
         path: 'profile',
         name: 'Profile',
         component: Profile,
         meta: { deynamiceTitle: '个人信息' },
      },
      {
         path: 'challenge/',
         name: 'Challenge',
         children: [
            {
               path: '',
               name: 'ChallengeList',
               component: Challenge,
               meta: { deynamiceTitle: '全部挑战' },
            },
            {
               path: 'detail',
               name: 'ChallengeDetail',
               component: ChallengeDetail,
               meta: { deynamiceTitle: '挑战详情' },
            },
         ],
      },
      {
         path: 'notification/',
         name: 'Notification',
         children: [
            {
               path: '',
               name: 'NotificationList',
               component: Notification,
               meta: { deynamiceTitle: '全部公告' },
            },
            {
               path: 'detail',
               name: 'NotificationDetail',
               component: NotificationDetail,
               meta: { deynamiceTitle: '公告详情' },
            },
         ],
      },
      {
         path: 'error',
         name: 'Error',
         direct: '/error/404',
         children: [
            {
               path: '404',
               name: '404',
               component: Error404,
               meta: { deynamiceTitle: '404 Not Found' },
            },
         ],
      },
   ],
};
