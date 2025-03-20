/**
 * 获取token
 */
export function getToken() {
   return localStorage.getItem('token');
}

/**
 * 设置token
 * @param token token
 */
export function setToken(token: string) {
   localStorage.setItem('token', token);
}

/**
 * 清除token
 */
export function delToken() {
   return localStorage.removeItem('token');
}
