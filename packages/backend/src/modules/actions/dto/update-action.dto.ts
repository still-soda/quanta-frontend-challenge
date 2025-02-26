import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsObject, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ActionsPayload } from '../actions.type';

export class UpdateActionDto {
    @ApiProperty({
        description: '标题',
        example: 'Solve Challenge',
    })
    @IsOptional()
    @IsString()
    @Expose()
    title?: string;

    @ApiProperty({
        description: '活动类型',
        example: 'solve-challenge',
    })
    @IsOptional()
    @IsString()
    @Expose()
    type?: string;

    @ApiProperty({
        description: '关键数据JSON数据',
        example: '{ "challengeName": "CSS Battle" }',
    })
    @IsOptional()
    @IsObject()
    @Expose()
    payload?: ActionsPayload;

    @ApiProperty({
        description: '用户ID',
        example: '1234567',
    })
    @IsOptional()
    @IsMongoId()
    @Expose()
    userId?: string;
}
