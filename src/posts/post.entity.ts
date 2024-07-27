import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../users/user.entity'
import { Comment } from '../comments/comment.entity'

@Entity()
export class Post {
  @ApiProperty({ example: 1, description: 'The unique identifier of the post' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @Column()
  title: string

  @ApiProperty({
    example: 'This is the content of my first post.',
    description: 'The content of the post',
  })
  @Column('text')
  content: string

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the post was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ApiProperty({
    example: '2023-07-26T10:00:00Z',
    description: 'The date when the post was last updated',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
