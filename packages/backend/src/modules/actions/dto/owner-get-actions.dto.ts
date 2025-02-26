import { SchemaProp } from "src/utils/schema-prop.util";

export const ownerGetActionsDtoProps: SchemaProp = {
    title: {
        type: 'string',
        description: '标题',
        example: 'Solve Challenge',
    },
    type: {
        type: 'string',
        description: '活动类型',
        example: 'solve-challenge',
    },
    payload: {
        type: 'object',
        description: '关键数据JSON数据',
        example: '{"challengeName":"CSS Battle"}',
    },
    userId: {
        type: 'string',
        description: '用户ID',
        example: '1234567',
    },
}