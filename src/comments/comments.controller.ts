import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 🟢 POST /comments/:articleId
  @Post(':articleId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createComment(
    @Param('articleId') articleId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(articleId, dto); // ✅ now matches service
  }

  // 🔵 GET /comments/:articleId
  @Get(':articleId')
  async getComments(@Param('articleId') articleId: number) {
    return this.commentsService.findByArticle(articleId);
  }

  // 🔴 DELETE /comments/:id
  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentsService.remove(id); // ✅ renamed to correct method name
  }
}
