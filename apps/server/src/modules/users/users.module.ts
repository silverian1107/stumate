import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { DecksModule } from '../decks/decks.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    QuizTestsModule,
    DecksModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
