<template>
   <h1
      style="view-transition-name: title"
      class="text-[2rem] font-bold bg-gradient-to-r from-dark-from to-dark-to bg-clip-text text-transparent w-fit mb-[0.3125rem] px-[0.5rem]">
      登录
   </h1>

   <div class="flex flex-col gap-[1.25rem]">
      <Input
         style="view-transition-name: username"
         v-model:value="username"
         name="username"
         placeholder="请输入用户名">
         <template #icon>
            <IdCard class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <Input
         style="view-transition-name: password"
         v-model:value="password"
         name="password"
         placeholder="请输入密码">
         <template #icon>
            <Key class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
   </div>

   <div class="flex justify-end text-[0.875rem] text-dark-normal">
      <RouterLink
         class="transition-colors duration-200 hover:text-orange-high"
         to="/auth/forget-password">
         找回密码
      </RouterLink>
   </div>

   <div class="flex justify-center gap-[0.625rem]">
      <Button
         @click="router.push('/auth/register')"
         style="view-transition-name: btn-left"
         class="border-[1px] px-[1.875rem] py-[0.3125rem]"
         type="secondary">
         注册
      </Button>
      <Button
         :disabled="onRequest"
         @click="onLoginBtnClick"
         style="view-transition-name: btn-right"
         class="px-[1.875rem] py-[0.3125rem]"
         type="primary">
         登录
      </Button>
   </div>
</template>

<script setup lang="ts">
import { Input, Button, useMessage } from '@/components';
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';
import { Key } from '@/components/Icons';
import { login } from '@challenge/api';
import IdCard from '@/components/Icons/IdCard.vue';

const router = useRouter();
const message = useMessage();

const username = ref('');
const password = ref('');

// 是否正在请求中
const onRequest = ref(false);

// 检查输入
function checkInput() {
   if (!username.value) {
      message.warning('请输入用户名', { duration: 3000 });
      return false;
   }
   if (!password.value) {
      message.warning('请输入密码', { duration: 3000 });
      return false;
   }
   return true;
}

// 处理登录
async function onLoginBtnClick() {
   if (!checkInput()) return;

   try {
      onRequest.value = true;
      await login({
         username: username.value,
         password: password.value,
      });
      message.success(`登录成功，${username.value}`, { duration: 3000 });
      router.push('/dashboard');
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
      onRequest.value = false;
   }
}
</script>
