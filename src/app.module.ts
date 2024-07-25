import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from '../datasource'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
