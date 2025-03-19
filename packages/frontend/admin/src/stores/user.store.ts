import { svgToBase64 } from '@challenge/utils';
import { getDefaultAvatar } from '@challenge/api';
import { DEFAULT_AVATAR } from '@/constant/default.constant';
import { UserSelf } from '@challenge/api/';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
   state: () => ({
      id: '',
      name: 'unknown',
      email: '',
      signature: '',
      number: '',
      totalScore: 0,
      totalSubmissions: 0,
      solvedChallenges: new Array<string>(),
      tryingChallenges: new Array<string>(),
      failedChallenges: new Array<string>(),
      avatar: DEFAULT_AVATAR,
   }),
   actions: {
      async updateUser(user: UserSelf) {
         this.name = user.username;
         this.id = user.id;
         this.email = user.email;
         this.signature = user.signature;
         this.totalScore = user.totalScore;
         this.totalSubmissions = user.totalSubmissions;
         this.solvedChallenges = user.solvedTasks;
         this.tryingChallenges = user.tryingTasks;
         this.failedChallenges = user.failedTasks;
         this.number = user.number;

         if (user.avatar) {
            this.avatar = user.avatar;
         } else {
            const {
               data: { avatar: svg },
            } = await getDefaultAvatar(user.id);
            this.avatar = svgToBase64(svg);
         }
      },
   },
});
