import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ads' })
  findAll() {
    return this.adsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ad by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOne(id);
  }

  // ✅ CREATE
  @Post()
  @ApiOperation({ summary: 'Create ad with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Diwali Offer' },
        link: { type: 'string', example: 'https://example.com' },
        image: { type: 'string', format: 'binary' },
        startTime: { type: 'string', example: '2025-10-29T09:00:00Z' },
        endTime: { type: 'string', example: '2025-10-31T23:59:59Z' },
      },
      required: ['title', 'image'],
    },
  })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto: CreateAdDto = {
      title: body.title,
      link: body.link,
      startTime: body.startTime,
      endTime: body.endTime,
    };

    return this.adsService.create(dto, file);
  }

  // ✅ UPDATE
  @Put(':id')
  @ApiOperation({ summary: 'Update ad (optionally replace image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Offer Title' },
        link: { type: 'string', example: 'https://updated-link.com' },
        image: { type: 'string', format: 'binary' },
        startTime: { type: 'string', example: '2025-10-30T09:00:00Z' },
        endTime: { type: 'string', example: '2025-11-01T23:59:59Z' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: UpdateAdDto = {
      title: body.title,
      link: body.link,
      startTime: body.startTime,
      endTime: body.endTime,
    };

    return this.adsService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ad' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.remove(id);
  }
}
