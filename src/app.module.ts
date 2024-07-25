import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsConsumer } from '@nestjs/core/guards';

TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  entities: [User, Post, Comment],
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}),

@Module({
  // TODO: what's the difference between an imported module and a provider?
  imports: [],
  // NOTE: controllers handle message handling from the server to the internal bits
  controllers: [AppController],
  // NOTE: providers are like decorators; another way to inject dependenices into another module
  providers: [AppService],
})
export class AppModule {}
