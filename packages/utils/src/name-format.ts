/**
 * 将短横线命名转换为驼峰命名
 * @param name 短横线命名
 * @returns 驼峰命名
 * @example
 * ```ts
 * kababCaseToCamelCase('kabob-case-to-camel-case') // => 'kabobCaseToCamelCase'
 * ```
 */
export function kabobCaseToCamelCase(name: string) {
   return name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 将驼峰命名转换为短横线命名
 * @param name 驼峰命名
 * @returns 短横线命名
 * @example
 * ```ts
 * camelCaseToKababCase('camelCaseToKabobCase') // => 'camel-case-to-kabob-case'
 * ```
 */
export function camelCaseToKabobCase(name: string) {
   return name.replace(/([A-Z])/g, (g) => '-' + g.toLowerCase());
}

/**
 * 将下划线命名转换为驼峰命名
 * @param name 下划线命名
 * @returns 驼峰命名
 * @example
 * ```ts
 * snakeCaseToCamelCase('snake_case_to_camel_case') // => 'snakeCaseToCamelCase'
 * ```
 */
export function snakeCaseToCamelCase(name: string) {
   return name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 将驼峰命名转换为下划线命名
 * @param name 驼峰命名
 * @returns 下划线命名
 * @example
 * ```ts
 * camelCaseToSnakeCase('camelCaseToSnakeCase') // => 'camel_case_to_snake_case'
 * ```
 */
export function camelCaseToSnakeCase(name: string) {
   return name.replace(/([A-Z])/g, (g) => '_' + g.toLowerCase());
}
