interface MessageData {
   msg: string;
   score: number;
   success: boolean;
}

interface ParseResult {
   text: string;
   score: number;
   success: boolean;
   imgIndex: number;
   type: 'action' | 'testpoint';
}

/**
 * 处理原始JSON字符串，返回解析后的数据
 * @param rawMessage 原始字符串
 * @returns 解析后的数据
 */
export function parseMessage(rawMessage: string): ParseResult[] {
   let messageDatas: MessageData[];
   try {
      messageDatas = JSON.parse(rawMessage);
   } catch (error) {
      throw error;
   }

   let imgCounter = 0;
   const result: ParseResult[] = messageDatas.map((data) => {
      const { msg, score, success } = data;
      if (!msg.startsWith('[')) {
         return { text: msg, score, success, imgIndex: -1, type: 'action' };
      }
      const imgIndex = msg.includes('截图') ? imgCounter++ : -1;
      return {
         text: parstText(msg, success),
         score,
         success,
         imgIndex,
         type: 'testpoint',
      };
   });

   return result;
}

function parstText(rawText: string, success: boolean) {
   if (!rawText.startsWith('[')) {
      return rawText;
   }
   const prefix = /\[(.+?)\]/.exec(rawText)?.[1].split(':').shift() || '';
   rawText = rawText.replace(/\[.+?\]:/, '');

   const [explanStr, statusStr] = rawText.split('::').map((str) => str.trim());
   return `[${prefix}]: ${explanStr} ${success ? '' : `=> ${statusStr}`}`;
}
