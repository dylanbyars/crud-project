import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Query(() => User)
  async user(@Args('id') id: number): Promise<User> {
    return this.usersService.findOne(id)
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: number): Promise<void> {
    return this.usersService.remove(id)
  }
}
