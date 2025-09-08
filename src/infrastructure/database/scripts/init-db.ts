import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../mikro-orm.config';

async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init<PostgreSqlDriver>(config);
    
    // Create database schema
    const generator = orm.getSchemaGenerator();
    
    // Drop schema if it exists (for clean start)
    await generator.dropSchema();
    console.log('Dropped existing schema');
    
    // Create schema
    await generator.createSchema();
    console.log('Created schema');
    
    // Create a test user
    const knex = orm.em.getKnex();
    
    // Insert a test user directly with SQL
    await knex.raw(`
      INSERT INTO users (name, email, password_hash, created_at, updated_at)
      VALUES ('Test User', 'test@example.com', 'password_hash_here', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('Created test user');
    
    await orm.close(true);
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
