import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from 'src/schema';

export type Database = NeonHttpDatabase<typeof schema>;

export const NeonDBProvider = {
  provide: 'NeonDBProvider',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const sql = neon(configService.get<string>('NEON_DB_URL')!);

    return drizzle(sql, { schema });
  },
};
