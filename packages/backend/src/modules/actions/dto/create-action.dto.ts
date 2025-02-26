import { ApiProperty } from "@nestjs/swagger";
import { ActionsPayload } from "../actions.type";
import { Expose } from "class-transformer";
import { IsMongoId, IsObject, IsString } from "class-validator";

export class CreateActionDto {
    @ApiProperty({
        description: '标题',
        example: 'Solve Challenge',
    })
    @IsString()
    @Expose()
    title: string;

    @ApiProperty({
        description: '活动类型',
        example: 'solve-challenge',
    })
    @IsString()
    @Expose()
    type: string;

    @ApiProperty({
        description: '关键数据JSON数据',
        example: '{ "challengeName": "CSS Battle" }',
    })
    @IsObject()
    @Expose()
    payload: ActionsPayload;

    @ApiProperty({
        description: '用户ID',
        example: '1234567',
    })
    @IsMongoId()
    @Expose()
    userId: string;
}
