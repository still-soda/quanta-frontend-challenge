/**
 * 生成一个颜色比较暗的图片
 * @param image 图片
 * @param rate 比例
 */
function generateDarkImage(
   image: HTMLImageElement,
   rate: number
): HTMLImageElement {
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');
   if (!context) return image;

   canvas.width = image.width;
   canvas.height = image.height;

   context.drawImage(image, 0, 0, image.width, image.height);

   const imageData = context.getImageData(0, 0, image.width, image.height);
   const data = imageData.data;

   for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * rate;
      data[i + 1] = data[i + 1] * rate;
      data[i + 2] = data[i + 2] * rate;
   }

   context.putImageData(imageData, 0, 0);

   const newImage = new Image();
   newImage.src = canvas.toDataURL();
   return newImage;
}

/**
 * 绘制图片
 * @param context 画布上下文
 * @param image 图片
 * @param range 范围
 */
function drawImage(
   context: CanvasRenderingContext2D | null,
   image: HTMLImageElement,
   range: { from: [number, number]; to: [number, number] }
): void {
   if (!context) return;

   const [startX, startY] = range.from;
   const width = range.to[0] - range.from[0];
   const height = range.to[1] - range.from[1];

   context.drawImage(image, startX, startY, width, height);
}

/**
 * 绘制图片的一部分
 * @param context 画布上下文
 * @param image 图片
 * @param from 起始点
 * @param to 终点
 * @param clipFrom 裁剪起始点
 * @param clipTo 裁剪终点
 */
function drawParticalImage(
   context: CanvasRenderingContext2D | null,
   image: HTMLImageElement,
   from: [number, number],
   to: [number, number],
   clipFrom: [number, number],
   clipTo: [number, number]
): void {
   if (!context) return;

   context.save();

   const path = new Path2D();
   path.rect(
      clipFrom[0],
      clipFrom[1],
      clipTo[0] - clipFrom[0],
      clipTo[1] - clipFrom[1]
   );
   context.clip(path);

   drawImage(context, image, { from, to });

   context.restore();
}

/**
 * 绘制分割线
 * @param context 画布上下文
 * @param from 起始点
 * @param to 终点
 * @param xCount x轴分割数量
 * @param yCount y轴分割数量
 */
function drawSplitLines(
   context: CanvasRenderingContext2D,
   from: [number, number],
   to: [number, number],
   xCount: number,
   yCount: number,
   color: string = '#555',
   lineWidth: number = 1
) {
   const xStep = (to[0] - from[0]) / xCount;
   const yStep = (to[1] - from[1]) / yCount;

   context.save();

   context.strokeStyle = color;
   context.lineWidth = lineWidth;

   for (let i = 0; i <= xCount; i++) {
      const x = from[0] + xStep * i;
      context.beginPath();
      context.moveTo(x, from[1]);
      context.lineTo(x, to[1]);
      context.stroke();
   }

   for (let i = 0; i <= yCount; i++) {
      const y = from[1] + yStep * i;
      context.beginPath();
      context.moveTo(from[0], y);
      context.lineTo(to[0], y);
      context.stroke();
   }

   context.restore();
}

export { generateDarkImage, drawImage, drawParticalImage, drawSplitLines };
