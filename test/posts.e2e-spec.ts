import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { DataSource } from 'typeorm'
import { generateEmail } from './email-generator.util'

describe('PostsController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let jwtToken: string
  const email = generateEmail()
  const password = 'password123'
  let postId: number

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    dataSource = app.get(DataSource)

    await request(app.getHttpServer())
      .post('/users')
      .send({
        email,
        password,
        bio: 'I am a test user',
      })
      .expect(201)

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201)
    expect(loginResponse.body).toHaveProperty('access_token')
    jwtToken = loginResponse.body.access_token
  })

  afterAll(async () => {
    await dataSource.destroy()
    await app.close()
  })

  it('/posts (POST) - create a post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'My First Post',
        content: 'This is the content of my first post.',
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)
    expect(response.body).toHaveProperty('id')
    postId = response.body.id
  })

  it('/posts (GET) - get all posts', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('author')
    postId = response.body[0].id
  })

  it('/posts/:id (GET) - get a single post', async () => {
    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(response.body).toHaveProperty('id', postId)
    expect(response.body).toHaveProperty('author')
  })

  it('/posts/:id (PATCH) - update a post', async () => {
    const newContent = 'yaya'
    await request(app.getHttpServer())
      .patch(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        content: newContent,
      })
      .expect(200)

    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(response.body).toHaveProperty('content', newContent)
  })

  it('/posts/:id (DELETE) - delete a post', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    // Verify that the post has been deleted
    return request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404)
  })
})
