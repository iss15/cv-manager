import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App') // Group this route under the "App" tag in Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a welcome message' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'Returns a welcome message.' }) // Document the response
  getHello(): string {
    return this.appService.getHello();
  }
}