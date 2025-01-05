import { inject } from 'vue';

class EventEmitter {
   private listeners: Map<string, Set<Function>> = new Map();

   /**
    * 监听事件
    * @param event 事件名称
    * @param listener 触发事件时的回调
    */
   on(event: string, listener: Function) {
      if (!this.listeners.has(event)) {
         this.listeners.set(event, new Set());
      }
      this.listeners.get(event)?.add(listener);
   }

   /**
    * 取消监听事件
    * @param event 事件名称
    * @param listener 触发事件时的回调
    */
   off(event: string, listener: Function) {
      this.listeners.get(event)?.delete(listener);
   }

   /**
    * 触发事件
    * @param event 事件名称
    * @param args 传递的参数
    */
   emit(event: string, ...args: any[]) {
      this.listeners.get(event)?.forEach((listener) => listener(...args));
   }
}

export const INJECT_KEY = Symbol('EventEmitter');

/**
 * 创建事件发射器
 */
export function createEventEmitter() {
   return new EventEmitter();
}

/**
 * 注入事件发射器
 */
export function useEventEmitter(key: Symbol = INJECT_KEY) {
   const emitter = inject(key) as EventEmitter | undefined;
   if (!emitter) {
      throw new Error('EventEmitter not provided');
   }
   return emitter;
}
