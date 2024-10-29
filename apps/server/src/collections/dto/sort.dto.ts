import { IsIn, IsOptional } from 'class-validator';

export class SortOptionsDto {
  @IsOptional()
  @IsIn(['name', 'position', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'position' | 'createdAt' | 'updatedAt' = 'position';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}
