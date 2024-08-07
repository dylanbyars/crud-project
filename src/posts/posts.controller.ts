import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post as PostEntity } from './post.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('posts')
@UseGuards(JwtAuthGuard)
@Controller('posts')
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: PostEntity,
  })
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, req.user.userId)
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Return all posts.',
    type: [PostEntity],
  })
  findAll() {
    return this.postsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the post.',
    type: PostEntity,
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostEntity,
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
