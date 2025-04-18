import { Controller, Get, Patch, UseGuards, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Profile') // Group routes under the "Profile" tag in Swagger
@ApiBearerAuth() // Require JWT authentication for these routes
@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get the profile of the logged-in user' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'The user profile.' }) // Document the response
  @ApiResponse({ status: 401, description: 'Unauthorized.' }) // Document possible errors
  getProfile(@GetUser() user: any) {
    return user;  
  }

  @Get('username')
  @ApiOperation({ summary: 'Get the username of the logged-in user' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'The username of the user.' }) // Document the response
  @ApiResponse({ status: 401, description: 'Unauthorized.' }) // Document possible errors
  getUsername(@GetUser('username') username: string) {
    return { username }; // Returns only the username
  }

  @Patch()
  @ApiOperation({ summary: 'Update the profile of the logged-in user' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'The user profile has been successfully updated.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  @ApiResponse({ status: 401, description: 'Unauthorized.' }) // Document possible errors
  async updateProfile(@GetUser('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto); // Updates the user's profile
  }

  @UseGuards(AdminGuard) // Restrict this route to admins only
  @Get('admin/users')
  @ApiOperation({ summary: 'Get all users (Admin only)' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'List of all users.' }) // Document the response
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can access this route.' }) // Document possible errors
  async getAllUsers() {
    return this.userService.findAll(); // Returns all users
  }

  @UseGuards(AdminGuard) // Restrict this route to admins only
  @Get('admin/users/:id')
  @ApiOperation({ summary: 'Get a specific user by ID (Admin only)' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The user details.' }) // Document the response
  @ApiResponse({ status: 404, description: 'User not found.' }) // Document possible errors
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can access this route.' }) // Document possible errors
  async getUserById(@Param('id') id: number) {
    return this.userService.findOne(id); // Returns a specific user
  }
}