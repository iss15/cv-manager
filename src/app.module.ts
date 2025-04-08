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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Cv, Skill],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule, 
    CvModule, 
    SkillModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}