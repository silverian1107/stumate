import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The todo text',
    example: 'Buy groceries',
  })
  todo: string;
}
