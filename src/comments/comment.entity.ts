import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../users/user.entity'
import { Post } from '../posts/post.entity'

@Entity()
export class Comment {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the comment',
  })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    example: 'This is a great post!',
    description: 'The content of the comment',
  })
  @Column('text')
  content: string

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'authorId' })
  author: User

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the comment was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the comment was last updated',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
