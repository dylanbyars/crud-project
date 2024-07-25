import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Post } from '../posts/post.entity'
import { Comment } from '../comments/comment.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  email: string

  // TODO: how to make this more secure?
  @Column()
  password: string

  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]
}
