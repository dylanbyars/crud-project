import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'The content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ example: 1, description: 'The ID of the author' })
  @IsNumber()
  @IsNotEmpty()
  authorId: number

  @ApiProperty({ example: 1, description: 'The ID of the post' })
  @IsNumber()
  @IsNotEmpty()
  postId: number
}
