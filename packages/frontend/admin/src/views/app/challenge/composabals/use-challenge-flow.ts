import { useId, useTemplateRef } from 'vue';
import CustomFlow from '@/components/CustomFlow/index.vue';
import { adminReadFile } from '@challenge/api';
import { useMessage } from '@/hooks/use-message.hook';

/**
 * 更新挑战流程
 * @returns
 * - `updateChallengeFlow`: 更新挑战流程的方法
 * - `FLOW_KEY`: 流程组件的 key
 */
export const useChallengeFlow = () => {
   const FLOW_KEY = useId();
   const customFlowRef =
      useTemplateRef<InstanceType<typeof CustomFlow>>(FLOW_KEY);
   const message = useMessage();

   async function updateChallengeFlow(flowdataId?: string) {
      if (!customFlowRef.value) return;
      if (!flowdataId) {
         customFlowRef.value.updateFlowData('[]');
         return;
      }
      try {
         const res = await adminReadFile(flowdataId);
         const { data } = res;
         if (data) {
            customFlowRef.value.updateFlowData(data);
         }
      } catch (error) {
         message.error('获取挑战流程失败');
      }
   }

   return { updateChallengeFlow, FLOW_KEY };
};
