import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { DataSource } from 'typeorm'
import { generateEmail } from './email-generator.util'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: number
  let jwtToken: string
  const email = generateEmail()
  const password = 'password123'

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
        email,
        password,
        bio: 'I am a test user',
      })
      .expect(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe(email)
    expect(response.body).not.toHaveProperty('password')
    expect(response.body.bio).toBe('I am a test user')
    userId = response.body.id
    console.log('made user -> ', email)
  })

  it('/auth/login (POST) - login and get JWT token', async () => {
    console.log(`using email -> ${email}`)
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201)
    expect(response.body).toHaveProperty('access_token')
    jwtToken = response.body.access_token
  })

  it('/users (POST) - fail to create a user with invalid data', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'invalid-email',
        password: 'short',
      })
      .expect(400)
  })

  it('/users (GET) - get all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('email')
    expect(response.body[0]).not.toHaveProperty('password')
  })

  it('/users/:id (GET) - get a single user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    expect(response.body).toHaveProperty('id', userId)
    expect(response.body.email).toBe(email)
    expect(response.body).not.toHaveProperty('password')
  })

  it('/users/:id (GET) - fail to get a non-existent user', () => {
    return request(app.getHttpServer())
      .get('/users/9999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404)
  })

  it('/users/:id (PATCH) - update a user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
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
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        email: 'invalid-email',
      })
      .expect(400)
  })

  it('/users/:id (DELETE) - delete a user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    // Verify that the user has been deleted
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404)
  })
})
