import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Comment } from '../src/comments/comment.entity'
import { User } from '../src/users/user.entity'
import { Post } from '../src/posts/post.entity'
import { generateUsername } from './username-generator.util'

describe('CommentsController (e2e)', () => {
  let app: INestApplication
  let commentRepository
  let userRepository
  let postRepository
  let testUser
  let testPost

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    commentRepository = moduleFixture.get(getRepositoryToken(Comment))
    userRepository = moduleFixture.get(getRepositoryToken(User))
    postRepository = moduleFixture.get(getRepositoryToken(Post))

    // Create a test user
    testUser = await userRepository.save({
      username: generateUsername(),
      email: 'test@example.com',
      password: 'password123',
    })

    // Create a test post
    testPost = await postRepository.save({
      title: 'Test Post',
      content: 'This is a test post content',
      author: testUser,
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('/comments (POST)', async () => {
    const newComment = {
      content: 'This is a test comment',
      authorId: testUser.id,
      postId: testPost.id,
    }

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(newComment)
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.content).toBe(newComment.content)
  })

  it('/comments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('content')
  })

  it('/comments/:id (GET)', async () => {
    const comment = await commentRepository.findOne({ where: {} })

    const response = await request(app.getHttpServer())
      .get(`/comments/${comment.id}`)
      .expect(200)

    expect(response.body).toHaveProperty('id', comment.id)
    expect(response.body).toHaveProperty('content', comment.content)
  })

  it('/comments/:id (PATCH)', async () => {
    const comment = await commentRepository.findOne({ where: {} })

    const updatedData = {
      content: 'Updated comment content',
    }

    const response = await request(app.getHttpServer())
      .patch(`/comments/${comment.id}`)
      .send(updatedData)
      .expect(200)

    expect(response.body).toHaveProperty('id', comment.id)
    expect(response.body).toHaveProperty('content', updatedData.content)
  })

  it('/comments/:id (DELETE)', async () => {
    const comment = await commentRepository.findOne({ where: {} })

    await request(app.getHttpServer())
      .delete(`/comments/${comment.id}`)
      .expect(200)

    // Verify the comment has been deleted
    const deletedComment = await commentRepository.findOne({
      where: { id: comment.id },
    })
    expect(deletedComment).toBeNull()
  })
})
