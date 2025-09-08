#!/bin/sh
set -e

# Wait for the database to be ready using netcat instead of psql
echo "Waiting for PostgreSQL to be ready..."
until nc -z -w1 "$DB_HOST" 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - waiting a bit more to ensure it's fully ready"
sleep 3

echo "Initializing database"
# Create tsconfig.json for ts-node
cat > /app/tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
EOL

# Run database initialization script
node --require ts-node/register src/infrastructure/database/scripts/init-db.ts

# Start the application
exec "$@"
