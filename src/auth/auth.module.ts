import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.strategy'
import { JWT_SECRET } from '../constants'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
