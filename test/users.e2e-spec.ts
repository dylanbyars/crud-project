import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { DataSource } from 'typeorm'
import { generateUsername } from './username-generator.util'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: number
  const username = generateUsername()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    dataSource = app.get(DataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
    await app.close()
  })

  it('/users (POST) - create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        username,
        email: 'test@example.com',
        password: 'password123',
        bio: 'I am a test user',
      })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.username).toBe(username)
    expect(response.body.email).toBe('test@example.com')
    expect(response.body).not.toHaveProperty('password')
    expect(response.body.bio).toBe('I am a test user')

    userId = response.body.id
  })

  it('/users (POST) - fail to create a user with invalid data', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        username: generateUsername(),
        email: 'invalid-email',
        password: 'short',
      })
      .expect(400)
  })

  it('/users (GET) - get all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('username')
    expect(response.body[0]).toHaveProperty('email')
    expect(response.body[0]).not.toHaveProperty('password')
  })

  it('/users/:id (GET) - get a single user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)

    expect(response.body).toHaveProperty('id', userId)
    expect(response.body.username).toBe(username)
    expect(response.body.email).toBe('test@example.com')
    expect(response.body).not.toHaveProperty('password')
  })

  it('/users/:id (GET) - fail to get a non-existent user', () => {
    return request(app.getHttpServer()).get('/users/9999').expect(404)
  })

  it('/users/:id (PATCH) - update a user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send({
        bio: 'Updated bio',
      })
      .expect(200)

    expect(response.body).toHaveProperty('id', userId)
    expect(response.body.bio).toBe('Updated bio')
  })

  it('/users/:id (PATCH) - fail to update with invalid data', () => {
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send({
        email: 'invalid-email',
      })
      .expect(400)
  })

  it('/users/:id (DELETE) - delete a user', async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200)

    // Verify that the user has been deleted
    return request(app.getHttpServer()).get(`/users/${userId}`).expect(404)
  })
})
