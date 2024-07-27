import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './post.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto)
    return await this.postsRepository.save(post)
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: ['author', 'comments'],
    })
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    })
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, updatePostDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }
}
