/**
 * 用于生成文档的接口
 */
export type SchemaProp = Record<
  string,
  {
    description: string;
    type: string;
    required: boolean;
    example: any;
    default?: any;
    items?: any;
    properties?: SchemaProp;
  }
>;
