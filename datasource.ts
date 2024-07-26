// NOTE: this was also giving me trouble with the compiler when I put it in `/src`.
// unlike the migration files, this one doesn't kill the compiler when it's here at the root of the project.
// And it works for db connections in nest and running the migrations..

import { DataSource } from 'typeorm'
import { User } from './src/users/user.entity'
import { Post } from './src/posts/post.entity'
import { Comment } from './src/comments/comment.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // NOTE: using .env or dotenv or AWS secrets or anything is a must instead of hardcoded creds
  username: 'myuser',
  password: 'mypassword',
  database: 'crud_db',
  entities: [User, Post, Comment],
  migrations: ['src/migrations/*.ts'],
  logging: true,
  logger: 'advanced-console',
})
