<template>
   <Layout class="w-screen h-screen flex flex-col items-center justify-center">
      <div class="fixed -bottom-[15rem] -left-[10rem]">
         <img
            src="@/assets/imgs/auth-cover.png"
            class="w-[50rem] opacity-50 pointer-events-none" />
      </div>

      <Content
         class="relative gap-6 flex flex-col justify-center items-center w-80">
         <h1
            class="text-3xl font-semibold w-fit bg-gradient-to-r from-dark-from to-dark-to text-transparent bg-clip-text">
            后台登录
         </h1>

         <Form
            class="w-full"
            :model="formData"
            label-width="0"
            @submit="handleSubmit">
            <FormItem name="username">
               <Input
                  size="large"
                  placeholder="请输入用户名"
                  v-model="formData.username">
                  <template #prefix-icon>
                     <Icon name="user"></Icon>
                  </template>
               </Input>
            </FormItem>

            <FormItem name="password">
               <Input
                  clearable
                  size="large"
                  placeholder="请输入密码"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'">
                  <template #prefix-icon>
                     <Icon name="lock-on"></Icon>
                  </template>
                  <template #suffix-icon>
                     <Icon
                        :name="showPassword ? 'browse' : 'browse-off'"
                        @click="showPassword = !showPassword"></Icon>
                  </template>
               </Input>
            </FormItem>

            <FormItem>
               <Button block size="large" type="submit" :loading="loading">
                  登录
               </Button>
            </FormItem>
         </Form>
      </Content>
   </Layout>
</template>

<script setup lang="ts">
import { useMessage } from '@/hooks/use-message.hook';
import { getSelf, login } from '@challenge/api';
import {
   Form,
   FormItem,
   Input,
   Icon,
   Button,
   Layout,
   Content,
} from 'tdesign-vue-next';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';
import { AppRoute } from '@/routes/app.route';

const message = useMessage();
const router = useRouter();

const showPassword = ref(false);
const formData = ref({
   username: '',
   password: '',
});

const loading = ref(false);

async function handleSubmit() {
   if (formData.value.username === '') {
      message.error('请输入用户名', { duration: 3000 });
      return;
   }

   if (formData.value.password === '') {
      message.error('请输入密码', { duration: 3000 });
      return;
   }

   try {
      loading.value = true;
      const result = await login(formData.value).then(getSelf);
      const self = result.data;

      if (self.role < 1) {
         throw new Error('你没有权限登录后台！');
      }
      await useUserStore().updateUser(self);
      message.success('登录成功', { duration: 3000 });

      router.push(AppRoute.DASHBOARD);
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
      loading.value = false;
   }
}
</script>
