import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async uploadToNewsBucket(file: Express.Multer.File): Promise<string> {
    const filePath = `${Date.now()}_${file.originalname}`;
    const { data, error } = await this.supabase.storage
      .from('news')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    const { data: publicUrl } = this.supabase.storage
      .from('news')
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  }
}
