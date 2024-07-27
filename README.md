# CRUD Project

This project is a CRUD (Create, Read, Update, Delete) API built with NestJS, TypeORM, and PostgreSQL. It demonstrates an API including authentication, authorization, and data validation.

## Features

- User management (CRUD operations)
- Post management (CRUD operations)
- Comment management (CRUD operations)
- Authentication using JWT
- Authorization using guards
- Data validation using pipes
- API documentation using Swagger

## Project Structure

The project follows a modular structure, with separate modules for users, posts, comments, and authentication. Each module contains its own controllers, services, and DTOs.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database. I ran it in a `podman` container running the postgres image hosted on dockerhub # TODO: record this
5. Run migrations: `npm run migration:run`
6. Start the server: `npm run start:dev`

## API Documentation

API documentation is available via Swagger UI. After starting the server, navigate to `http://localhost:3000/api` in your web browser to view the interactive API documentation.

## Test it!

`npm run test:e2e`

## Key Concepts and Implementation

### 1. Interceptors

#### ClassSerializerInterceptor and Excluding Sensitive Data

The `ClassSerializerInterceptor` in NestJS works in conjunction with class-transformer decorators to exclude or expose specific properties when serializing objects. However, it doesn't automatically exclude sensitive information on its own. The exclusion of sensitive data, like passwords, is actually achieved through the use of the `@Exclude()` decorator from the `class-transformer` library.

Here's how it works in this project:

1. In the `User` entity (`src/users/user.entity.ts`), the `password` field is decorated with `@Exclude()`:

```typescript
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  // ... other fields

  @Column()
  @Exclude()
  password: string;

  // ... other fields
}
```

2. The `ClassSerializerInterceptor` is applied to the `UsersController`:

```typescript
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  // ... controller methods
}
```

3. When the `ClassSerializerInterceptor` processes the response, it uses the `class-transformer` library to serialize the `User` objects. During this serialization, any properties marked with `@Exclude()` (like the `password` field) are omitted from the output.

So, the combination of the `@Exclude()` decorator and the `ClassSerializerInterceptor` ensures that sensitive information like passwords is not included in the API responses.

It's important to note that this exclusion happens at the serialization level, which means:

1. The `password` field still exists in the database and in the `User` objects within the application.
2. The exclusion only applies when the object is being serialized for a response, typically when sending data back to the client.

This approach provides a clean way to manage which data is exposed via your API without having to manually filter it in each route handler.

### 2. Guards

Guards are used for authentication and authorization. The project uses two main guards:

1. `JwtAuthGuard`: Used to protect routes that require authentication.

Example usage in `UsersController`:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  // ... controller methods
}
```

2. `LocalStrategy` guard: Used for email/password authentication during login.

Example usage in `AuthController`:

```typescript
@UseGuards(AuthGuard('local'))
@Post('login')
async login(@Request() req) {
  return this.authService.login(req.user);
}
```

### 3. Custom Decorators

The project includes a custom `@Public()` decorator to mark routes that should be publicly accessible without authentication.

Definition in `src/auth/public.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Usage in `UsersController`:

```typescript
@Public()
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### 4. Pipes

Pipes in NestJS are used for data transformation and validation. This project primarily uses the `ValidationPipe`, which is applied globally to validate incoming request data against DTO (Data Transfer Object) schemas.

#### Global ValidationPipe

The `ValidationPipe` is configured globally in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

This configuration does the following:

1. `whitelist: true`: Strips out properties that don't have any decorators in the DTO.
2. `forbidNonWhitelisted: true`: Throws an error if non-whitelisted properties are present.
3. `transform: true`: Automatically transforms incoming payloads to be instances of their respective DTO classes.

#### How It Works

The `ValidationPipe` works in conjunction with DTO classes that use class-validator decorators. For example, in the `CreateUserDto`:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
```

When a request is made to create a user, the `ValidationPipe` will:

1. Validate that `email` is a valid email address.
2. Ensure that `password` is a string with a minimum length of 6 characters.
3. Allow `bio` to be optional, but if present, ensure it's a string.
4. Remove any additional properties not defined in the DTO.
5. If any validation fails, it will return a 400 Bad Request error with details about the validation failure.

#### Benefits

- Automatic validation of incoming data
- Type safety when working with data in controllers and services
- Enhanced security by stripping unexpected properties
- Cleaner controller code by moving validation logic to DTOs

This approach ensures that only valid data is processed by the application, enhancing overall data integrity and security.

## GraphQL

## GraphQL Integration

This project incorporates GraphQL alongside the REST API, providing a flexible and efficient way to query and manipulate data. The GraphQL implementation uses NestJS's built-in support for GraphQL with the `@nestjs/graphql` package and the Apollo server.

### Setup

The GraphQL module is configured in the `AppModule` (`src/app.module.ts`):

```typescript
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    // ... other imports
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

This configuration:
- Uses the Apollo driver for GraphQL
- Automatically generates a GraphQL schema file (`schema.gql`) based on the application's GraphQL definitions

### Resolvers

The project uses resolvers to define GraphQL operations. For example, the `UsersResolver` (`src/users/users.resolver.ts`) defines queries and mutations for user-related operations:

### GraphQL Types

GraphQL object types are defined using classes with decorators from `@nestjs/graphql`. For instance, the `User` type is defined in `src/users/user.schema.ts`:

```typescript
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => ID)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
```

### Accessing GraphQL Playground

Once the server is running, you can access the GraphQL Playground at `http://localhost:3000/graphql`. This interactive environment allows you to explore the GraphQL schema, write and execute queries and mutations, and view the results.

### Benefits of GraphQL

1. **Flexible Data Fetching**: Clients can request exactly the data they need, no more, no less.
2. **Single Endpoint**: All data operations go through a single endpoint, simplifying API management.
3. **Strong Typing**: The GraphQL schema provides a clear contract between client and server.
4. **Efficient**: Reduces over-fetching and under-fetching of data, which can be common in REST APIs.

### Coexistence with REST

This project demonstrates how GraphQL can coexist with a traditional REST API. This dual approach allows for flexibility in how clients interact with the server, catering to different use cases and client requirements.

By incorporating both REST and GraphQL, the project showcases a modern, flexible API design that can adapt to various client needs and preferences.
