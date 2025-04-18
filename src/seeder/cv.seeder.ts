import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import { UserService } from '../user/user.service';
import { Cv } from '../cv/entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cvService = app.get(CvService);
  const skillService = app.get(SkillService);
  const userService = app.get(UserService);

  // Seed Skills
  const skills = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const skill = new Skill();
      skill.designation = faker.person.jobType();
      return skillService.create(skill);
    })
  );

  // Seed Users and CVs
  await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      // Create a User
      const user = new User();
      user.username = faker.internet.username();
      user.email = faker.internet.email();

      // Generate a hashed password
      const hashedPassword = await bcrypt.hash('password123', 10); // 10 is the salt rounds
      user.password = hashedPassword;
      user.role = faker.helpers.arrayElement(['user', 'admin']); // Randomly assign a role

      const savedUser = await userService.create(user);

      // Create a CV for the User
      const cv = new Cv();
      cv.name = faker.person.lastName();
      cv.firstname = faker.person.firstName();
      cv.age = faker.number.int({ min: 20, max: 60 });
      cv.cin = faker.string.alphanumeric(8);
      cv.job = faker.person.jobTitle();
      cv.path = faker.internet.url();
      cv.skills = skills;
      cv.user = savedUser; // Associate the CV with the User

      return cvService.create(cv);
    })
  );

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();