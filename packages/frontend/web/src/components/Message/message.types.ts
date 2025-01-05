export type MessageType = 'info' | 'error' | 'warning' | 'success';

export interface MethodsOptions {
   duration?: number;
   confirm?: boolean;
}

export interface ProvidedMethods {
   send: (type: MessageType, text: string, options: MethodsOptions) => void;
   success: (text: string, options: MethodsOptions) => void;
   error: (text: string, options: MethodsOptions) => void;
   warning: (text: string, options: MethodsOptions) => void;
   info: (text: string, options: MethodsOptions) => void;
}

export interface Message {
   id: string;
   text: string;
   type: MessageType;
   duration?: number;
   confirm?: boolean;
}
