import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Ad } from 'src/entity/ads';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { createClient } from '@supabase/supabase-js';
import * as process from 'process';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'news'; // your Supabase bucket name

@Injectable()
export class AdsService {
    constructor(
        @InjectRepository(Ad)
        private readonly adsRepo: Repository<Ad>,
    ) { }

    async findAll(): Promise<Ad[]> {
        await this.deactivateExpiredAds(); // ✅ Automatically disable expired ads
        return this.adsRepo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: number): Promise<Ad> {
        const ad = await this.adsRepo.findOne({ where: { id } });
        if (!ad) throw new NotFoundException('Ad not found');
        return ad;
    }

    async create(dto: CreateAdDto, file?: Express.Multer.File): Promise<Ad> {
        const ad = this.adsRepo.create({
            title: dto.title,
            link: dto.link,
            startTime: dto.startTime,
            endTime: dto.endTime,
            isActive: true, // optional default
        });

        if (file) {
            const url = await this.uploadToSupabase(file);
            ad.image = url;
        } else {
            throw new InternalServerErrorException('Image file required for Ad');
        }

        return await this.adsRepo.save(ad);
    }


    async update(
        id: number,
        dto: UpdateAdDto,
        file?: Express.Multer.File,
    ): Promise<Ad> {
        const ad = await this.findOne(id);

        Object.assign(ad, {
            title: dto.title?.trim() ? dto.title : ad.title,
            link: dto.link?.trim() ? dto.link : ad.link,
            startTime: dto.startTime ? new Date(dto.startTime) : ad.startTime,
            endTime: dto.endTime ? new Date(dto.endTime) : ad.endTime,
        });

        if (file) {
            const url = await this.uploadToSupabase(file);
            ad.image = url;
        }

        return await this.adsRepo.save(ad);
    }


    async remove(id: number) {
        const ad = await this.findOne(id);
        return this.adsRepo.remove(ad);
    }

    private async uploadToSupabase(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}_${file.originalname}`;
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error)
            throw new InternalServerErrorException('Supabase upload failed: ' + error.message);

        const { publicUrl } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(data.path).data;

        return publicUrl;
    }

    private async deactivateExpiredAds() {
        const now = new Date();
        await this.adsRepo.update(
            { endTime: LessThanOrEqual(now), isActive: true },
            { isActive: false },
        );
    }
}
