import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import fs from 'fs';

import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, host, user, password, port, sslCA, sslMode } =
          configService.mysql;

        let ssl = null;

        if (sslMode) {
          console.log('ssl mode');
          ssl = {
            ca: fs.readFileSync('../ca-certificate.crt').toString(),
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
          ssl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
