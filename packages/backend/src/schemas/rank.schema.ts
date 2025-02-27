import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Document } from "mongoose";

export type RankDocument = Rank & Document;

@Schema()
@ApiSchema({ description: '排行榜' })
export class Rank extends Document {
    @ApiProperty({
        example: '123456',
        description: '用户ID',
    })
    @Prop({ index: true })
    userId: string;

    @ApiProperty({
        example: 100,
        description: '分数',
    })
    @Prop()
    score: number;

    @ApiProperty({
        example: 1,
        description: '排名',
    })
    @Prop()
    rank: number;

    @ApiProperty({
        example: '2021-01-01',
        description: '排名时间',
    })
    @Prop({ index: true })
    time: Date;
}

export const RankSchema = SchemaFactory.createForClass(Rank);