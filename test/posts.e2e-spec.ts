import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Post } from '../src/posts/post.entity'
import { User } from '../src/users/user.entity'
import { generateUsername } from './username-generator.util'

describe('PostsController (e2e)', () => {
  let app: INestApplication
  let postRepository
  let userRepository

  let user

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    postRepository = moduleFixture.get(getRepositoryToken(Post))
    userRepository = moduleFixture.get(getRepositoryToken(User))

    // create a user
    user = await userRepository.save({
      username: generateUsername(),
      email: 'test@example.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('/posts (POST)', async () => {
    const newPost = {
      title: 'Test Post',
      content: 'This is a test post content',
      authorId: user.id,
    }

    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(newPost)
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe(newPost.title)
    expect(response.body.content).toBe(newPost.content)
  })

  it('/posts (GET)', async () => {
    // NOTE: this is a good example of why the tests _should_ run against a test db that can be wiped away whenever. I'd definitely set that up for a real project.
    // Create some test posts
    await postRepository.save([
      { title: 'Post 1', content: 'Content 1', author: user },
      { title: 'Post 2', content: 'Content 2', author: user },
    ])

    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('title')
    expect(response.body[0]).toHaveProperty('content')
  })

  it('/posts/:id (GET)', async () => {
    // Create a test post
    const post = await postRepository.save({
      title: 'Test Post',
      content: 'This is a test post content',
      author: user,
    })

    const response = await request(app.getHttpServer())
      .get(`/posts/${post.id}`)
      .expect(200)

    expect(response.body).toHaveProperty('id', post.id)
    expect(response.body).toHaveProperty('title', post.title)
    expect(response.body).toHaveProperty('content', post.content)
  })

  it('/posts/:id (PATCH)', async () => {
    // Create a test post
    const post = await postRepository.save({
      title: 'Original Title',
      content: 'Original content',
      author: user,
    })

    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content',
    }

    const response = await request(app.getHttpServer())
      .patch(`/posts/${post.id}`)
      .send(updatedData)
      .expect(200)

    expect(response.body).toHaveProperty('id', post.id)
    expect(response.body).toHaveProperty('title', updatedData.title)
    expect(response.body).toHaveProperty('content', updatedData.content)
  })

  it('/posts/:id (DELETE)', async () => {
    // Create a test post
    const post = await postRepository.save({
      title: 'Test Post',
      content: 'This is a test post content',
      author: user,
    })

    await request(app.getHttpServer()).delete(`/posts/${post.id}`).expect(200)

    // Verify the post has been deleted
    const deletedPost = await postRepository.findOne({ where: { id: post.id } })
    expect(deletedPost).toBeNull()
  })
})
