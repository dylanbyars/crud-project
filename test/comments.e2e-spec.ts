import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { DataSource } from 'typeorm'
import { generateEmail } from './email-generator.util'
import { User } from 'src/users/user.entity'
import { Post } from 'src/posts/post.entity'
import { Comment } from 'src/comments/comment.entity'

describe('CommentsController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let jwtToken: string
  const email = generateEmail()
  const password = 'password123'
  let user: User
  let post: Post
  let comment: Comment

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    dataSource = app.get(DataSource)

    // create user
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        email,
        password,
        bio: 'I am a test user',
      })
      .expect(201)

    user = userResponse.body

    // create jwt
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201)
    expect(loginResponse.body).toHaveProperty('access_token')
    jwtToken = loginResponse.body.access_token

    // create post
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'test post',
        content: 'This is the content of my post.',
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)

    post = postResponse.body
  })

  afterAll(async () => {
    await dataSource.destroy()
    await app.close()
  })

  it('/comments (POST)', async () => {
    const newComment = {
      content: 'This is a test comment',
      authorId: user.id,
      postId: post.id,
    }

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(newComment)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.content).toBe(newComment.content)
  })

  it('/comments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('content')
  })

  it('/comments (GET) - get all comments', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('author')
    comment = response.body[0]
  })

  it('/comments/:id (GET) - get a single comment', async () => {
    const response = await request(app.getHttpServer())
      .get(`/comments/${comment.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(response.body).toHaveProperty('content')
  })

  it('/comments/:id (PATCH) - update a comment', async () => {
    const newContent = 'yaya'
    await request(app.getHttpServer())
      .patch(`/comments/${comment.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ content: newContent })
      .expect(200)

    const response = await request(app.getHttpServer())
      .get(`/comments/${comment.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(response.body).toHaveProperty('content', newContent)
  })

  it('/comments/:id (DELETE) - delete a comment', async () => {
    await request(app.getHttpServer())
      .delete(`/comments/${comment.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    // Verify that the comment has been deleted
    return request(app.getHttpServer())
      .get(`/comments/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404)
  })
})
