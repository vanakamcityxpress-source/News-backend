// src/Ads/dto/create-ad.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdDto {
  @ApiProperty({ example: 'Diwali Offer', description: 'Title of the ad' })
  title: string;

  @ApiProperty({ example: 'https://example.com', description: 'Optional link' })
  link?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload ad image',
    required: false, // ✅ mark optional for TypeScript, still visible in Swagger
  })
  image?: any;

  @ApiProperty({ example: '2025-10-29T09:00:00Z', description: 'Start time (ISO format)' })
  startTime?: Date;

  @ApiProperty({ example: '2025-10-31T23:59:59Z', description: 'End time (ISO format)' })
  endTime?: Date;
}
