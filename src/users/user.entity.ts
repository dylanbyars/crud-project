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

  @Column()
  password: string

  @Column({ nullable: true })
  bio: string

  @OneToMany(() => Post, post => post.author)
  posts: Post[]

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
