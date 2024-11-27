import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './schema/todo.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Todo',
        schema: TodoSchema,
      },
    ]),
    CaslModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
