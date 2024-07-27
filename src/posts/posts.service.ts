import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './post.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const author = await this.usersService.findOne(authorId)
    if (!author) {
      throw new BadRequestException('Invalid author ID')
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      author,
    })
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
