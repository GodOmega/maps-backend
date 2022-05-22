import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const {dbUrl, dbType} = configService
        const { dbName, host, user, password, port, } =
          configService.mysql;

        let sslConfig = {};

        if (process.env.NODE_ENV === 'production') {
          sslConfig = {
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          };
        }

        return {
          type: 'mysql',
          host,
          port,
          database: dbName,
          username: user,
          password,
          autoLoadEntities: true,
          synchronize: false,
          ...sslConfig,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
