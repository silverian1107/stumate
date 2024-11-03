import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { UsersModule } from './modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CollectionsModule } from './modules/collections/collections.module';
import { NotesModule } from './modules/notes/notes.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { DecksModule } from './modules/decks/decks.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';

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
          connection.plugin(softDeletePlugin);
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
