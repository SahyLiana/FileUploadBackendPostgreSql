/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from './db/db.module';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(DRIZZLE) private db: any,
  ) {}

  async register(email: string, pass: string, avatarUrl: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    try {
      const [newUser] = await this.db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          avatarUrl,
        })
        .returning();
      return { message: 'Compte créé avec succès !', userId: newUser.id };
    } catch (error) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }
  }

  async login(email: string, pass: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Identifiants incorrects');

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      avatarUrl: user.avatarUrl,
    };
  }
}
