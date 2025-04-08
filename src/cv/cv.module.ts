import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvControllerV2 } from './cv.controller.v2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])],
  controllers: [CvController, CvControllerV2],
  providers: [CvService],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CvController, CvControllerV2);
  }
}


//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NDQwMzU4NTQsImV4cCI6MTc3NTU3MTg1NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjoiTWFuYWdlciIsInVzZXJJZCI6IjUifQ.KkM-c3tOC4Y0tx_7t4u-QhTfYHz7tqPlmQc7s57dSbI