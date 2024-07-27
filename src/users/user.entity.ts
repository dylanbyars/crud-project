import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Post } from '../posts/post.entity'
import { Comment } from '../comments/comment.entity'

@Entity('user')
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  @Column({ unique: true })
  username: string

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @Column()
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @Column()
  @Exclude()
  password: string

  @ApiProperty({
    example: 'I am a software developer',
    description: 'A short bio of the user',
  })
  @Column({ nullable: true })
  bio: string

  @ApiProperty({ type: () => [Post] })
  @OneToMany(() => Post, post => post.author)
  posts: Post[]

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[]

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the user was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the user was last updated',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
