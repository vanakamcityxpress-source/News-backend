// ormconfig.ts or data-source.ts
export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'city_xpress',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
