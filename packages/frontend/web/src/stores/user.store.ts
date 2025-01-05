import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
   state: () => ({
      name: 'still-soda',
      avatar:
         'https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg',
   }),
});
