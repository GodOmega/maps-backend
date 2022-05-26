import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const fs = require('fs');
const path = require('path');

import config from '../config';

import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, host, user, password, port } = configService.mysql;

        let certificate = {};

        if (process.env.NODE_ENV === 'production') {
          certificate = {
            ca: fs.readFileSync(path.resolve('./src/ca-certificate.crt')),
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
          ...certificate,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
