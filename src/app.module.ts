import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { UsersModule } from './users/users.module';
import { WorkerModule } from './workers/worker.module';
import { AuthModule } from './auth/auth.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: joi.object({
        MYSQL_NAME: joi.string().required(),
        MYSQL_PORT: joi.number().required(),
        MYSQL_HOST: joi.string().required(),
        MYSQL_USER: joi.string().required(),
        AUTH_JWT_SECRET: joi.string().required(),
        MYSQL_SSL_CERTIFICATE: joi.string(),
      }),
    }),
    DatabaseModule,
    EnterpriseModule,
    UsersModule,
    WorkerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
