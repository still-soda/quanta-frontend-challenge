<template>
   <h1
      style="view-transition-name: title"
      class="text-[2rem] mt-[2rem] font-bold bg-gradient-to-r from-dark-from to-dark-to bg-clip-text text-transparent w-fit mb-[0.3125rem] px-[0.5rem]">
      注册
   </h1>

   <div class="flex flex-col gap-[1.25rem]">
      <Input
         style="view-transition-name: username"
         v-model:value="username"
         placeholder="请输入用户名">
         <template #icon>
            <IdCard class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <Input v-model:value="number" name="number" placeholder="请输入学号">
         <template #icon>
            <User class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <Input v-model:value="mail" name="email" placeholder="请输入邮箱">
         <template #icon>
            <Mail class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <div class="flex gap-[0.625rem] w-[18.5625rem] h-full relative">
         <Input
            class="shrink"
            v-model:value="captcha"
            name="captcha"
            placeholder="请输入结果">
            <template #icon>
               <Robot class="text-dark-normal size-[1.5rem]" />
            </template>
         </Input>
         <div
            class="w-[6.25rem] h-[2.75rem] shrink-0 flex items-center rounded-inside bg-orange-200 cursor-pointer"
            @click="refreshCaptcha">
            <div class="my-auto flex" v-html="captchaContent"></div>
         </div>
      </div>
      <Input
         style="view-transition-name: password"
         v-model:value="password"
         name="password"
         placeholder="请输入密码">
         <template #icon>
            <Key class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <Input
         v-model:value="confirmPassword"
         name="confirm-password"
         placeholder="请确认密码">
         <template #icon>
            <Key class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
   </div>

   <div class="flex justify-center gap-[0.625rem] mb-[2rem]">
      <Button
         @click="router.push('/auth/login')"
         style="view-transition-name: btn-left"
         class="border-[1px] px-[1.875rem] py-[0.3125rem]"
         type="secondary">
         返回登录
      </Button>
      <Button
         :disabled="onRegister"
         @click="handleRegister"
         style="view-transition-name: btn-right"
         class="px-[1.875rem] py-[0.3125rem]"
         type="primary">
         注册
      </Button>
   </div>
</template>

<script setup lang="ts">
import { Input, Button, useMessage } from '@/components';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { User, Key, IdCard, Robot, Mail } from '@/components/Icons';
import { getCaptcha, register } from '@/apis/auth.api';

const router = useRouter();
const message = useMessage();

const username = ref('');
const number = ref('');
const mail = ref('');
const captcha = ref('');
const password = ref('');
const confirmPassword = ref('');

function checkInput() {
   if (!username.value) {
      message.error('用户名不能为空', { duration: 3000 });
      return false;
   }
   if (!number.value) {
      message.error('学号不能为空', { duration: 3000 });
      return false;
   }
   if (!mail.value) {
      message.error('邮箱不能为空', { duration: 3000 });
      return false;
   }
   if (!captcha.value) {
      message.error('验证码不能为空', { duration: 3000 });
      return false;
   }
   if (!password.value) {
      message.error('密码不能为空', { duration: 3000 });
      return false;
   }
   if (password.value !== confirmPassword.value) {
      message.error('两次密码不一致', { duration: 3000 });
      return false;
   }
   return true;
}

const captchaContent = ref('');
let captchaId = '';
onMounted(() => refreshCaptcha());
async function refreshCaptcha() {
   let result;
   try {
      result = await getCaptcha();
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
      return;
   }
   captchaContent.value = result.data.svg;
   captchaId = result.data.id;
}

const onRegister = ref(false);
async function handleRegister() {
   if (!checkInput()) return;

   try {
      onRegister.value = true;
      await register({
         username: username.value,
         number: number.value,
         email: mail.value,
         captcha: captcha.value,
         password: password.value,
         captchaId,
      });
      message.success('注册成功', { duration: 3000 });
      router.push('/auth/login');
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
      onRegister.value = false;
   }
}
</script>
