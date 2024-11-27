import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The todo text',
    example: 'Buy groceries',
  })
  todo: string;
}
