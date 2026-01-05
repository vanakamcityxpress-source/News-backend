import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBreakingNewsDto {
  @ApiProperty({ example: 'Breaking: Major Event' })
  @IsString()
  heading: string;

  @ApiProperty({ example: 'Detailed description of the breaking news...' })
  @IsString()
  description: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1') return true;
    if (value === 'false' || value === false || value === 0 || value === '0') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}