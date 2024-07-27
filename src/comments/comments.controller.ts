import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Comment } from './comment.entity'

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: Comment,
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Return all comments.',
    type: [Comment],
  })
  findAll() {
    return this.commentsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the comment.',
    type: Comment,
  })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
    type: Comment,
  })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id)
  }
}
