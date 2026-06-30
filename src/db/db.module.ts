import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

// 1. Initialize the neon connection pool over HTTP/WebSockets
const sql = neon(process.env.DATABASE_URL!);

// 2. Pass it directly to drizzle
export const db = drizzle({ client: sql });

@Module({
  providers: [
    {
      provide: 'DRIZZLE_INSTANCE',
      useValue: db,
    },
  ],
  exports: ['DRIZZLE_INSTANCE'],
})
export class DbModule {}
