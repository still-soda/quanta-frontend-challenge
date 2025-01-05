function generateNormalDistributionData(
   mean: number,
   stdDev: number,
   size: number
) {
   const data = [];
   for (let i = 0; i < size; i++) {
      const u1 = Math.random();
      const u2 = Math.random();

      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

      const value = mean + z0 * stdDev;
      data.push({ score: value });
   }
   return data;
}

const mean = 50; // 均值
const stdDev = 10; // 标准差
const size = 1000; // 数据数量

/**
 * 符合正态分布的分数模拟数据
 *
 * #### 数据结构：
 *
 * ```javascript
 * [
 *    { score: number }
 * ]
 * ```
 */
const scoresMock = generateNormalDistributionData(mean, stdDev, size);

export default scoresMock;
