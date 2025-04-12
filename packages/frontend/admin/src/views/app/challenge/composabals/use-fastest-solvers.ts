import { ref } from 'vue';
import { getDefaultAvatar, getUserById } from '@challenge/api';
import { useMessage } from '@/hooks/use-message.hook';
import { svgToBase64 } from '@challenge/utils';
import { User } from '@challenge/api/models';

/**
 * 获取最快解决者信息，
 * @returns
 * - `updateFastestSolvers`: 更新最快解决者信息的方法
 * - `fastestSolvers`: 当前的最快解决者信息
 */
export const useFastestSolvers = () => {
   const message = useMessage();

   const fastestSolvers = ref<User[]>([]);
   async function updateFastestSolvers(resolverIds: string[]) {
      try {
         const res = await Promise.all(
            resolverIds.map((id) => getUserById(id))
         );
         const datas = res.map((item) => item.data);
         const avatarPromises = datas
            .filter((item) => !item.avatar)
            .map(async (item) => {
               return getDefaultAvatar(item.id).then((res) => {
                  item.avatar = svgToBase64(res.data.avatar);
               });
            });
         await Promise.all(avatarPromises);
         fastestSolvers.value = datas;
      } catch (error) {
         message.error('获取最快解决者失败');
      }
   }

   return { updateFastestSolvers, fastestSolvers };
};
