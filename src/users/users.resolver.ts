import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Query(returns => User)
  async user(@Args('id') id: number): Promise<User> {
    return this.usersService.findOne(id)
  }

  @Mutation(returns => Boolean)
  async removeUser(@Args('id') id: number): Promise<boolean> {
    await this.usersService.remove(id)
    return true
  }
}
