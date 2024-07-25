import { DataSource } from 'typeorm'
import { User } from './src/users/user.entity'
import { Post } from './src/posts/post.entity'
import { Comment } from './src/comments/comment.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'crud_db',
  entities: [User, Post, Comment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
})
