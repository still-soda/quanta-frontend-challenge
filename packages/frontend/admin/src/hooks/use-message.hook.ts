import { MessagePlugin } from 'tdesign-vue-next';

interface MessageOptions {
   duration?: number;
}

function success(msg: string, options?: MessageOptions) {
   MessagePlugin.success({
      content: msg,
      duration: options?.duration,
      zIndex: 9999,
      attach: '#t-message-attach-target',
   });
}

function error(msg: string, options?: MessageOptions) {
   MessagePlugin.error({
      content: msg,
      duration: options?.duration,
      zIndex: 9999,
      attach: '#t-message-attach-target',
   });
}

function warning(msg: string, options?: MessageOptions) {
   MessagePlugin.warning({
      content: msg,
      duration: options?.duration,
      zIndex: 9999,
      attach: '#t-message-attach-target',
   });
}

function info(msg: string, options?: MessageOptions) {
   MessagePlugin.info({
      content: msg,
      duration: options?.duration,
      zIndex: 9999,
      attach: '#t-message-attach-target',
   });
}

export function useMessage() {
   return {
      success,
      error,
      warning,
      info,
   };
}
