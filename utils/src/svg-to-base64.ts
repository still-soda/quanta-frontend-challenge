/**
 * 将svg转换为base64
 * @param svg SVG 文本
 * @returns Base64 字符串
 */
export function svgToBase64(svg: string) {
   return `data:image/svg+xml;base64,${btoa(svg)}`;
}
