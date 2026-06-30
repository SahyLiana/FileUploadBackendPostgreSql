import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-http'; // <--- Changed this line
import { neon } from '@neondatabase/serverless';

// 1. Initialize your Neon HTTP connection function
const sql = neon(process.env.DATABASE_URL!);

// 2. Pass it directly into the neon-http drizzle instance
export const db = drizzle({ client: sql }); // <--- Keep the client wrapper here

export const DRIZZLE = 'DRIZZLE';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useValue: db,
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
