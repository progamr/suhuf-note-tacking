import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/User';
import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';
import { Note } from './entities/Note';

const config: Options<PostgreSqlDriver> = {
  entities: [User, Conversation, Message, Note],
  dbName: process.env.DB_NAME || 'ai_notes',
  driver: PostgreSqlDriver,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'db', // This points to the Docker service name
  port: Number(process.env.DB_PORT) || 5432,
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './dist/infrastructure/database/migrations',
    pathTs: './src/infrastructure/database/migrations'
  },
  // Enable schema creation
  schemaGenerator: {
    createForeignKeyConstraints: true,
    disableForeignKeys: false
  }
};

export default config;