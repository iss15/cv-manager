import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import { UserService } from '../user/user.service';
import { Cv } from '../cv/entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { faker } from '@faker-js/faker';

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

  // Seed CVs
  const cvs = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const cv = new Cv();
      cv.name = faker.person.lastName();
      cv.firstname = faker.person.firstName();
      cv.age = faker.number.int({ min: 20, max: 60 });
      cv.cin = faker.string.alphanumeric(8);
      cv.job = faker.person.jobTitle();
      cv.path = faker.internet.url();
      cv.skills = skills;
      return cvService.create(cv);
    })
  );

  // Seed Users
  await Promise.all(
    cvs.map(async (cv) => {
      const user = new User();
      user.username = faker.internet.username();
      user.email = faker.internet.email();
      user.password = faker.internet.password();
      if(!user.cvs){
        user.cvs = []; // Initialize the cvs array if it doesn't exist
      }
      user.cvs.push(cv); // Associate the CV with the user
      return userService.create(user);
    })
  );

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();