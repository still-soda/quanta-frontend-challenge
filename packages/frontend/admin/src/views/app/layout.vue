<template>
   <TLayout class="h-screen">
      <TAside>
         <TMenu
            theme="light"
            value="dashboard"
            style="margin-right: 50px"
            height="550px">
            <template #logo>
               <img
                  width="136"
                  class="logo"
                  src="https://www.tencent.com/img/index/menu_logo_hover.png"
                  alt="logo" />
            </template>
            <TMenuItem value="dashboard">
               <template #icon>
                  <TIcon name="dashboard" />
               </template>
               仪表盘
            </TMenuItem>
            <TMenuItem value="resource">
               <template #icon>
                  <TIcon name="server" />
               </template>
               资源列表
            </TMenuItem>
            <TMenuItem value="root">
               <template #icon>
                  <TIcon name="root-list" />
               </template>
               根目录
            </TMenuItem>
            <TMenuItem value="control-platform">
               <template #icon>
                  <TIcon name="control-platform" />
               </template>
               调度平台
            </TMenuItem>
            <TMenuItem value="precise-monitor">
               <template #icon>
                  <TIcon name="precise-monitor" />
               </template>
               调度平台
            </TMenuItem>
            <TMenuItem value="mail">
               <template #icon>
                  <TIcon name="mail" />
               </template>
               消息区
            </TMenuItem>
            <TMenuItem value="user-circle">
               <template #icon>
                  <TIcon name="user-circle" />
               </template>
               个人中心
            </TMenuItem>
            <TMenuItem value="play-circle">
               <template #icon>
                  <TIcon name="play-circle" />
               </template>
               视频区
            </TMenuItem>
            <TMenuItem value="edit1">
               <template #icon>
                  <TIcon name="edit-1" />
               </template>
               资源编辑
            </TMenuItem>
         </TMenu>
      </TAside>
      <TLayout>
         <TContent>
            <div>
               <RouterView />
            </div>
         </TContent>
         <TFooter>
            Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights
            Reserved
         </TFooter>
      </TLayout>
   </TLayout>
</template>

<script setup lang="ts"></script>
