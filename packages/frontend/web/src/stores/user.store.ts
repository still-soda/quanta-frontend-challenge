import { User } from '@/models/user.model';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
   state: () => ({
      name: 'unknown',
      avatar:
         'https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg',
      totalSubmissions: 0,
      email: '',
      signature: '',
      id: '',
   }),
   actions: {
      updateUser(user: User) {
         this.name = user.username;
         this.avatar =
            user.avatar ||
            'https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg';
         this.totalSubmissions = user.totalSubmissions;
         this.email = user.email;
         this.signature = user.signature;
         this.id = user.id;
      },
   },
});
