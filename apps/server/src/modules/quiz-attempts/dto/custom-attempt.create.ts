import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCustomAttemptDto {
  @IsNotEmpty()
  @IsArray()
  selectedQuizzes: string[];

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfQuestions: number;
}
