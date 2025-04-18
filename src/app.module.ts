import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';
import { Skill } from './skill/entities/skill.entity';
import { AuthModule } from './auth/auth.module';
import { UniqueValidator } from './common/validators/unique.validator';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SmolAgentController } from './smolagent.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'build'), // Path to the React build folder
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Cv, Skill],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UserModule, 
    CvModule, 
    SkillModule, 
    AuthModule
  ],
  controllers: [AppController, SmolAgentController],
  providers: [AppService, UniqueValidator],
})
export class AppModule {}