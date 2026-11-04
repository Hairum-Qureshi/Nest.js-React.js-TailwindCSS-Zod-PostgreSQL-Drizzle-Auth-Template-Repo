import { pgTable, text, bigint, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: bigint({ mode: 'bigint' }).primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  profile_picture: text('profile_picture').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
