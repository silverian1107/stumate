import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { DecksModule } from '../decks/decks.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    QuizTestsModule,
    DecksModule,
    TagsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
