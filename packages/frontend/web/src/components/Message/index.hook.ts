import { inject } from 'vue';
import { ProvidedMethods } from './message.types';

export function useMessage(): ProvidedMethods {
   const message = inject<ProvidedMethods>('__message_provider__');
   if (!message) {
      throw new Error('必须在 MessageProvider 中调用 useMessage()');
   }
   return message;
}
