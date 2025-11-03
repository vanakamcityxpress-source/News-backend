import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Ravi',
    description: 'The name of the person posting the comment',
  })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    example: 'மிகவும் நன்றாக எழுதப்பட்டுள்ளது!',
    description: 'The actual comment text',
  })
  @IsString()
  @Length(2, 500)
  comment: string;
}
