import knex from 'knex';

if (!process.env) {
  throw new Error('DATABASE_URL not configured in .env file.');
}
// console.log("==================================== knex connect ======================")
export default knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  debug: true,
  pool: { min: 1, max: 2000 },
  acquireConnectionTimeout: 30000,
});
