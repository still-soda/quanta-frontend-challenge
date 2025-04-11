import { useVueFlow } from '@vue-flow/core';
import { nextTick, watchEffect } from 'vue';

export const useLayout = () => {
   const { nodes, fitView } = useVueFlow();

   function layout(options?: { gap?: number }) {
      watchEffect(() => {
         if (!nodes.value.length || nodes.value[0].dimensions.width === 0) {
            return;
         }
         const gap = options?.gap ?? 50;
         let currentX = 0;
         nodes.value.forEach((node) => {
            node.position.x = currentX;
            node.position.y = -node.dimensions.height / 2;
            currentX += node.dimensions.width + gap;
         });
         fitView();
      });
   }

   return { layout };
};
