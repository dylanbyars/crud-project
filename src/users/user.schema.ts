import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(type => ID)
  id: number

  @Field({ nullable: true })
  firstName?: string

  @Field()
  email: string

  @Field({ nullable: true })
  bio?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
