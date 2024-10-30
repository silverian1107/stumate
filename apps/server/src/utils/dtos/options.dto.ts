import { IsOptional, IsEnum } from 'class-validator';

export class SortOptions {
  @IsOptional()
  @IsEnum(['name', 'position', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'position' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
