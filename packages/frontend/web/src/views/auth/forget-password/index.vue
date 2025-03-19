<template>
   <h1
      style="view-transition-name: title"
      class="text-[2rem] mt-[2rem] font-bold bg-gradient-to-r from-dark-from to-dark-to bg-clip-text text-transparent w-fit mb-[0.3125rem] px-[0.5rem]">
      找回密码
   </h1>

   <div class="flex flex-col gap-[1.25rem]">
      <Input v-model:value="mail" name="email" placeholder="请输入绑定邮箱">
         <template #icon>
            <Mail class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <div class="flex gap-[0.625rem] w-[18.5625rem] h-full relative">
         <Input
            class="shrink"
            v-model:value="captcha"
            name="captcha"
            placeholder="请输入验证码">
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
      <div class="flex gap-[0.625rem] w-[18.5625rem] relative">
         <Input
            class="shrink"
            v-model:value="identity"
            name="identity"
            placeholder="请输入身份码">
            <template #icon>
               <IdCard class="text-dark-normal size-[1.5rem]" />
            </template>
         </Input>
         <Button
            :disabled="countdown > 0"
            @click="sendIdentity"
            class="w-[4.8485rem] shrink-0 rounded-inside items-center justify-center flex text-nowrap flex-nowrap">
            {{ countdown > 0 ? `${countdown} s` : '发送' }}
         </Button>
      </div>
      <Input
         style="view-transition-name: password"
         v-model:value="password"
         name="password"
         placeholder="请输入新密码">
         <template #icon>
            <Key class="text-dark-normal size-[1.5rem]" />
         </template>
      </Input>
      <Input
         v-model:value="confirmPassword"
         name="confirm-password"
         placeholder="请确认新密码">
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
         style="view-transition-name: btn-right"
         class="px-[1.875rem] py-[0.3125rem]"
         type="primary">
         修改密码
      </Button>
   </div>
</template>

<script setup lang="ts">
import { Input, Button, useMessage } from '@/components';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { Key, IdCard, Robot, Mail } from '@/components/Icons';
import { getCaptcha } from '@challenge/api';

const router = useRouter();
const message = useMessage();

const mail = ref('');
const captcha = ref('');
const identity = ref('');
const password = ref('');
const confirmPassword = ref('');

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

const countdown = ref(0);
let timer: NodeJS.Timeout;
function sendIdentity() {
   if (countdown.value > 0) return;
   countdown.value = 60;
   timer = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) clearInterval(timer);
   }, 1000);
}

onUnmounted(() => clearInterval(timer));
</script>
