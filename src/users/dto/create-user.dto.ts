import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  @IsString()
  username: string

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({
    required: false,
    example: 'I am a software developer',
    description: 'A short bio of the user',
  })
  @IsOptional()
  @IsString()
  bio?: string
}
