import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from '../datasource'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
