/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CloudinaryService } from './cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    let avatarUrl = '';
    if (file) {
      avatarUrl = await this.cloudinaryService.uploadFile(file);
    }
    return this.authService.register(body.email, body.password, avatarUrl);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}
