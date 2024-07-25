import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Comment } from '../comments/comment.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column('text')
  content: string

  @ManyToOne(() => User, user => user.posts)
  user: User

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]
}
