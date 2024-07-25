import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { Post } from '../posts/post.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  content: string

  @ManyToOne(() => User, user => user.comments)
  user: User

  @ManyToOne(() => Post, post => post.comments)
  post: Post
}
