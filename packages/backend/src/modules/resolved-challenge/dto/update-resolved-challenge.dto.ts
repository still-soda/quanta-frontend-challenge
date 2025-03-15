import { PartialType } from '@nestjs/swagger';
import { CreateResolvedChallengeDto } from './create-resolved-challenge.dto';

export class UpdateResolvedChallengeDto extends PartialType(CreateResolvedChallengeDto) {}
