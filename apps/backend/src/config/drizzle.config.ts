import { defineConfig } from 'drizzle-kit';

if (!process.env.NEON_DB_URL) {
  throw new Error('NEON_DB_URL is not set in the .env file');
}

export default defineConfig({
  schema: './src/schema.ts', // Your schema file path
  out: './drizzle', // Your migrations folder
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DB_URL,
  },
});
