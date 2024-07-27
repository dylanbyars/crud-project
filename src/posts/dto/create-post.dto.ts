import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    example: 'This is the content of my first post.',
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ example: 1, description: 'The ID of the author' })
  @IsNumber()
  @IsNotEmpty()
  authorId: number
}
