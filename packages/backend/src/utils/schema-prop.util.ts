/**
 * 用于生成文档的接口
 */
export type SchemaProp = Record<
  string,
  {
    description: string;
    type: string;
    example: any;
    required?: boolean;
    default?: any;
    items?: any;
    properties?: SchemaProp;
  }
>;
