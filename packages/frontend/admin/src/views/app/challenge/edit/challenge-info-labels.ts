export interface Labels {
   [key: string]:
      | {
           title: string;
           type: 'text' | 'number' | 'raw';
           readonly?: boolean;
        }
      | {
           title: string;
           type: 'select' | 'pick';
           options: { label: string; value: string }[];
           readonly?: boolean;
        };
}

export const challengeInfoLabels: Labels = {
   id: {
      title: '挑战 ID',
      type: 'raw',
      readonly: true,
   },
   createdAt: {
      title: '创建时间',
      type: 'raw',
      readonly: true,
   },
   title: {
      title: '挑战标题',
      type: 'text',
   },
   difficulty: {
      title: '难度',
      type: 'select',
      options: [
         { label: '简单', value: 'easy' },
         { label: '中等', value: 'medium' },
         { label: '困难', value: 'hard' },
      ],
   },
   score: {
      title: '分数',
      type: 'number',
      readonly: true,
   },
   type: {
      title: '类型',
      type: 'text',
   },
   tags: {
      title: '标签',
      type: 'pick',
      options: [
         { label: 'Web', value: 'web' },
         { label: 'Crypto', value: 'crypto' },
         { label: 'Pwn', value: 'pwn' },
         { label: 'Reversing', value: 'reversing' },
         { label: 'Misc', value: 'misc' },
         { label: 'Forensics', value: 'forensics' },
         { label: 'OSINT', value: 'osint' },
         { label: 'Steganography', value: 'steganography' },
      ],
   },
};
