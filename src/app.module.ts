import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from './db/db.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_local_temporaire',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CloudinaryService],
})
export class AppModule {}
