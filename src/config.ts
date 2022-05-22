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
    dbType: process.env.DB_TYPE || 'mysql',
    authJwtSecret: process.env.AUTH_JWT_SECRET
  };
});
