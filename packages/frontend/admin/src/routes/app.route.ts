export enum AppRoute {
   // 仪表盘
   DASHBOARD = '/dashboard',
   // 挑战
   CHALLENGE_MANAGE = '/challenge/manage',
   CHALLENGE_SUBMIT = '/challenge/submit',
   CHALLENGE_PUBLISH = '/challenge/publish',
   // 标签
   TAG_MANAGE = '/tag/manage',
   TAG_SEARCH = '/tag/search',
   // 公告
   NOTIFICATION_MANAGE = '/notification/manage',
   NOTIFICATION_VIEW_DATA = '/notification/view-data',
   NOTIFICATION_PUBLISH = '/notification/publish',
   // 用户
   USER_MANAGE = '/user/manage',
   USER_ACTION = '/user/action',
   USER_RESPONSE = '/user/response',
   // 得分排名
   RANK = '/rank',
   // 访问数据
   BROWSE = '/browse',
   // 作答数据
   RESPONSE = '/response',
}

export const appRoutes = [
   // 仪表盘
   {
      path: AppRoute.DASHBOARD,
      name: '/Dashboard',
      component: () => import('@/views/app/dashboard/index.vue'),
   },
   // 挑战
   {
      path: AppRoute.CHALLENGE_MANAGE,
      name: '/Challenge Manage',
      component: () => import('@/views/app/challenge/manage/index.vue'),
   },
   {
      path: AppRoute.CHALLENGE_SUBMIT,
      name: '/Challenge Submit',
      component: () => import('@/views/app/challenge/submit/index.vue'),
   },
   {
      path: AppRoute.CHALLENGE_PUBLISH,
      name: '/Challenge Publish',
      component: () => import('@/views/app/challenge/publish/index.vue'),
   },
   // // 标签
   // {
   //    path: AppRoute.TAG_MANAGE,
   //    name: '/Tag Manage',
   //    component: () => import('@/views/app/tag/manage/index.vue'),
   // },
   // {
   //    path: AppRoute.TAG_SEARCH,
   //    name: '/Tag Search',
   //    component: () => import('@/views/app/tag/search/index.vue'),
   // },
   // // 公告
   // {
   //    path: AppRoute.NOTIFICATION_MANAGE,
   //    name: '/Notification Manage',
   //    component: () => import('@/views/app/notification/manage/index.vue'),
   // },
   // {
   //    path: AppRoute.NOTIFICATION_VIEW_DATA,
   //    name: '/Notification View Data',
   //    component: () => import('@/views/app/notification/view-data/index.vue'),
   // },
   // {
   //    path: AppRoute.NOTIFICATION_PUBLISH,
   //    name: '/Notification Publish',
   //    component: () => import('@/views/app/notification/publish/index.vue'),
   // },
   // // 用户
   // {
   //    path: AppRoute.USER_MANAGE,
   //    name: '/User Manage',
   //    component: () => import('@/views/app/user/manage/index.vue'),
   // },
   // {
   //    path: AppRoute.USER_ACTION,
   //    name: '/User Action',
   //    component: () => import('@/views/app/user/action/index.vue'),
   // },
   // {
   //    path: AppRoute.USER_RESPONSE,
   //    name: '/User Response',
   //    component: () => import('@/views/app/user/response/index.vue'),
   // },
   // // 得分排名
   // {
   //    path: AppRoute.RANK,
   //    name: '/Rank',
   //    component: () => import('@/views/app/rank/index.vue'),
   // },
   // // 访问数据
   // {
   //    path: AppRoute.BROWSE,
   //    name: '/Browse',
   //    component: () => import('@/views/app/browse/index.vue'),
   // },
   // // 作答情况
   // {
   //    path: AppRoute.RESPONSE,
   //    name: '/Response',
   //    component: () => import('@/views/app/response/index.vue'),
   // },
];
