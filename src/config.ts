import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mysql: {
      dbName: process.env.MYSQL_NAME,
      port: parseInt(process.env.MYSQL_PORT),
      password: process.env.MYSQL_PASSWORD,
      user: process.env.MYSQL_USER,
      host: process.env.MYSQL_HOST || 'localhost',
    },
    dbUrl: process.env.DB_URL,
    dbType: process.env.TYPEORM_CONNECTION,
    authJwtSecret: process.env.AUTH_JWT_SECRET
  };
});
