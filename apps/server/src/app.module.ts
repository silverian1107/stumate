import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CollectionsModule } from './modules/collections/collections.module';
import { NotesModule } from './modules/notes/notes.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { DecksModule } from './modules/decks/decks.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { QuizQuestionsModule } from './modules/quiz-questions/quiz-questions.module';
import { QuizAttemptsModule } from './modules/quiz-attempts/quiz-attempts.module';
import { QuizTestsModule } from './modules/quiz-tests/quiz-tests.module';
import { TagsModule } from './modules/tags/tags.module';
import { SharedResourcesModule } from './modules/shared-resources/shared-resources.module';
import { UserStatisticsModule } from './modules/user-statistics/user-statistics.module';
import MongooseDelete from 'mongoose-delete';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CollectionsModule,
    NotesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(MongooseDelete, {
            overrideMethods: 'all',
            deletedAt: true,
            deletedBy: true,
            deletedByType: String,
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"stumate" <${configService.get<string>('MAIL_FROM')}>`,
        },
        // preview: true,
        template: {
          dir: join(__dirname, 'mail/templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AttachmentsModule,
    DecksModule,
    FlashcardsModule,
    QuizQuestionsModule,
    QuizAttemptsModule,
    QuizTestsModule,
    TagsModule,
    SharedResourcesModule,
    UserStatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
