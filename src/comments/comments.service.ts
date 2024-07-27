import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Comment } from './comment.entity'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto)
    return await this.commentsRepository.save(comment)
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentsRepository.find({ relations: ['author', 'post'] })
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    })
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
    return comment
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.commentsRepository.update(id, updateCommentDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentsRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
  }
}
