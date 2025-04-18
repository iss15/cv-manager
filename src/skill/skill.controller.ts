import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Skills') // Group routes under the "Skills" tag in Swagger
@ApiBearerAuth() // Require JWT authentication for these routes
@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' }) // Describe the purpose of the route
  @ApiResponse({ status: 201, description: 'The skill has been successfully created.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all skills' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'List of all skills.' }) // Document the response
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a skill by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the skill to retrieve' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The skill details.' }) // Document the response
  @ApiResponse({ status: 404, description: 'Skill not found.' }) // Document possible errors
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the skill to update' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The skill has been successfully updated.' }) // Document the response
  @ApiResponse({ status: 404, description: 'Skill not found.' }) // Document possible errors
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the skill to delete' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The skill has been successfully deleted.' }) // Document the response
  @ApiResponse({ status: 404, description: 'Skill not found.' }) // Document possible errors
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
}