export type AcitveMockType = {
   [year: number]: {
      [month: number]: {
         [day: number]: {
            level: 'low' | 'mid' | 'high';
            submit: number;
         };
      };
   };
};
