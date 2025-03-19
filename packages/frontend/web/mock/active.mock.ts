type AcitveMockType = {
   [year: number]: {
      [month: number]: {
         [day: number]: {
            level: 'low' | 'mid' | 'high';
            submit: number;
         };
      };
   };
};

/**
 * 每日活跃度模拟数据
 *
 * #### 数据结构
 *
 * ```javascript
 * {
 *    year: {
 *       month: {
 *          day: 'low' | 'mid' | 'high',
 *          submit: (1~3:low) (3~6:mid)(6~~:high)
 *       }
 *    }
 * }
 * ```
 */
const activeMock = (() => {
   const year = [2023, 2024];
   const possibleStatus = ['low', 'mid', 'high'];
   const data = {} as any;
   year.forEach((y) => {
      data[y] = {} as any;
      for (let i = 1; i <= 12; i++) {
         data[y][i] = {} as any;
         const dayCount = new Date(y, i, 0).getDate();
         for (let j = 1; j <= dayCount; j++) {
            const status = Math.floor(Math.random() * 4);
            if (status === 3) continue;
            data[y][i][j] = {
               level: possibleStatus[status],
               submit: 3 * status + Math.floor(3 * Math.random()),
            };
         }
      }
   });
   return data;
})() as AcitveMockType;

export default activeMock;
