import 'dotenv/config';

export default {
  schema: './src/models',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'development'
        ? 'postgres://neon:npg@neon-local:5432/neondb'
        : process.env.DATABASE_URL,
  },
};
