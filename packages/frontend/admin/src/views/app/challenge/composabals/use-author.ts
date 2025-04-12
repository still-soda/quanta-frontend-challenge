import { ref } from 'vue';
import { getDefaultAvatar, getUserById } from '@challenge/api';
import { useMessage } from '@/hooks/use-message.hook';
import { svgToBase64 } from '@challenge/utils';
import { User } from '@challenge/api/models';

/**
 * 获取作者信息
 * @returns
 * - `updateAuthor`: 更新作者信息
 * - `author`: 作者信息
 */
export const useAuthor = () => {
   const message = useMessage();

   const author = ref<User>();
   async function updateAuthor(authorId: string) {
      try {
         const res = await getUserById(authorId);
         res.data.avatar =
            res.data.avatar ??
            svgToBase64((await getDefaultAvatar(authorId)).data.avatar);
         author.value = res.data;
      } catch (error) {
         message.error('获取作者信息失败');
      }
   }

   return { updateAuthor, author };
};
