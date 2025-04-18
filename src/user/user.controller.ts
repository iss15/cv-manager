import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Users') // Group routes under the "Users" tag in Swagger
@ApiBearerAuth() // Require JWT authentication for these routes
@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard) 
  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Describe the purpose of the route
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AdminGuard) 
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'List of all users.' }) // Document the response
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The user details.' }) // Document the response
  @ApiResponse({ status: 404, description: 'User not found.' }) // Document possible errors
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the user to update' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' }) // Document the response
  @ApiResponse({ status: 404, description: 'User not found.' }) // Document possible errors
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AdminGuard) // Restrict this route to admins only
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the user to delete' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' }) // Document the response
  @ApiResponse({ status: 404, description: 'User not found.' }) // Document possible errors
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can access this route.' }) // Document possible errors
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}