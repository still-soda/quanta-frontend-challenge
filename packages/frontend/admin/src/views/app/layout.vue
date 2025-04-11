<template>
   <TLayout class="h-screen">
      <TAside class="w-fit shrink-0 overflow-hidden">
         <TMenu
            theme="light"
            :value="activeMenu"
            style="margin-right: 0px"
            expand-mutex
            class="w-fit"
            height="550px"
            :collapsed="collapsed"
            @change="handleChange">
            <template #logo>
               <img
                  width="32"
                  class="rounded-full"
                  src="@/assets/imgs/quanta-logo.jpg"
                  alt="logo" />
               <h1
                  class="ml-2 font-semibold text-orange-high transition duration-300"
                  :class="{
                     'opacity-0 pointer-events-none': collapsed,
                  }">
                  Quanta前端挑战后台
               </h1>
            </template>

            <TMenuItem :value="AppRoute.DASHBOARD">
               <template #icon><TIcon name="dashboard" /></template>
               仪表盘
            </TMenuItem>

            <TSubmenu value="challenge" title="挑战">
               <template #icon><TIcon name="assignment-code" /></template>
               <TMenuItem :value="AppRoute.CHALLENGE_MANAGE">
                  <template #icon><TIcon name="list" /></template>
                  管理挑战
               </TMenuItem>
               <TMenuItem :value="AppRoute.CHALLENGE_SUBMIT">
                  <template #icon><TIcon name="analytics" /></template>
                  作答情况
               </TMenuItem>
               <TMenuItem :value="AppRoute.CHALLENGE_PUBLISH">
                  <template #icon><TIcon name="upload" /></template>
                  发布挑战
               </TMenuItem>
            </TSubmenu>

            <TSubmenu value="tag" title="标签">
               <template #icon>
                  <TIcon name="tag" />
               </template>
               <TMenuItem :value="AppRoute.TAG_MANAGE">
                  <template #icon><TIcon name="list" /></template>
                  管理标签
               </TMenuItem>
               <TMenuItem :value="AppRoute.TAG_SEARCH">
                  <template #icon><TIcon name="search" /></template>
                  标签查询
               </TMenuItem>
            </TSubmenu>

            <TSubmenu value="article" title="公告">
               <template #icon><TIcon name="article" /></template>
               <TMenuItem :value="AppRoute.NOTIFICATION_MANAGE">
                  <template #icon><TIcon name="list" /></template>
                  管理公告
               </TMenuItem>
               <TMenuItem :value="AppRoute.NOTIFICATION_VIEW_DATA">
                  <template #icon><TIcon name="analytics" /></template>
                  浏览数据
               </TMenuItem>
               <TMenuItem :value="AppRoute.NOTIFICATION_PUBLISH">
                  <template #icon><TIcon name="upload" /></template>
                  发布公告
               </TMenuItem>
            </TSubmenu>

            <TSubmenu value="user" title="用户">
               <template #icon><TIcon name="user" /></template>
               <TMenuItem :value="AppRoute.USER_MANAGE">
                  <template #icon><TIcon name="list" /></template>
                  管理用户
               </TMenuItem>
               <TMenuItem :value="AppRoute.USER_ACTION">
                  <template #icon><TIcon name="activity" /></template>
                  行为数据
               </TMenuItem>
               <TMenuItem :value="AppRoute.USER_RESPONSE">
                  <template #icon><TIcon name="markup" /></template>
                  作答情况
               </TMenuItem>
            </TSubmenu>

            <TMenuItem :value="AppRoute.RANK">
               <template #icon><TIcon name="leaderboard" /></template>
               得分排名
            </TMenuItem>

            <TMenuItem :value="AppRoute.BROWSE">
               <template #icon><TIcon name="accessibility" /></template>
               访问数据
            </TMenuItem>

            <TMenuItem :value="AppRoute.RESPONSE">
               <template #icon><TIcon name="calendar-edit" /></template>
               作答数据
            </TMenuItem>

            <template #operations>
               <TSpace size="small" :direction="collapsed ? 'vertical' : ''">
                  <TButton
                     variant="text"
                     shape="square"
                     @click="handleCollapse">
                     <TIcon name="menu-fold" />
                  </TButton>
                  <TPopconfirm
                     :visible="logoutConfirmVisible"
                     @visible-change="onVisibleChange"
                     content="确认要登出吗？">
                     <TButton variant="text" shape="square">
                        <TIcon name="logout" />
                     </TButton>
                  </TPopconfirm>
               </TSpace>
            </template>
         </TMenu>
      </TAside>

      <TLayout class="h-screen overflow-auto">
         <TContent>
            <RouterView v-slot="{ Component }">
               <div class="w-full p-4">
                  <Transition name="page" mode="out-in">
                     <Component :is="Component" />
                  </Transition>
               </div>
            </RouterView>
         </TContent>
      </TLayout>
   </TLayout>
</template>

<script setup lang="ts">
import { useMessage } from '@/hooks/use-message.hook';
import { AppRoute } from '@/routes/app.route';
import { logout } from '@challenge/api';
import { PopconfirmProps } from 'tdesign-vue-next';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const message = useMessage();

const paths = ref<string[]>([]);
watchEffect(() => {
   paths.value = router.getRoutes().map((route) => route.path);
});

// 处理折叠菜单
const collapsed = ref(false);
function handleCollapse() {
   collapsed.value = !collapsed.value;
}

// 处理登出
const logoutConfirmVisible = ref(false);
const onVisibleChange: PopconfirmProps['onVisibleChange'] = async (
   val,
   context
) => {
   if (context && context.trigger === 'confirm') {
      await logout();
      message.success('登出成功', { duration: 3000 });
      router.push('/login');
   } else {
      logoutConfirmVisible.value = val;
   }
};

// 处理菜单更改
const activeMenu = ref(route.path);
function handleChange(active: AppRoute) {
   if (paths.value.includes(active)) {
      router.push(active);
      activeMenu.value = active;
   } else {
      message.error(`不存在路由 "${active}"`, { duration: 3000 });
   }
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
   transition:
      opacity 0.5s,
      transform 0.5s,
      filter 0.3s;
}

.page-enter-from,
.page-leave-to {
   opacity: 0;
   filter: blur(10px);
   transform: translateY(1.25rem);
}

.page-enter-to,
.page-leave-from {
   opacity: 1;
   filter: blur(0);
   transform: translateY(0);
}
</style>
