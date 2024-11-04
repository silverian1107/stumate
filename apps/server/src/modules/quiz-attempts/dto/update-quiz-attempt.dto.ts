import { IsEnum, IsOptional } from 'class-validator';

enum Status {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
}

export class UpdateStatusQuizAttemptDto {
  @IsOptional()
  @IsEnum(Status)
  status: string;
}
