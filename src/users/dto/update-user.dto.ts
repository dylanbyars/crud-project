import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'baz',
    description: 'The first name of the user',
  })
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'The password of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @ApiPropertyOptional({
    example: 'I am a software developer',
    description: 'A short bio of the user',
  })
  @IsOptional()
  @IsString()
  bio?: string
}
