import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/schema/user.schema';
import { Collection } from 'src/modules/collections/schema/collection.schema';
import { Note } from 'src/modules/notes/schema/note.schema';
import { Deck } from 'src/modules/decks/schema/deck.schema';
import { Flashcard } from 'src/modules/flashcards/schema/flashcard.schema';
import { QuizTest } from 'src/modules/quiz-tests/schema/quiz-test.schema';
import { IUser } from 'src/modules/users/users.interface';
import { QuizAttempt } from 'src/modules/quiz-attempts/schema/quiz-attempt.schema';
import { QuizQuestion } from 'src/modules/quiz-questions/schema/quiz-question.schema';
import { UserStatistic } from 'src/modules/statistics/schema/user-statistic.schema';
import { Summary } from 'src/modules/summaries/schema/summary.schema';
import { Tag } from 'src/modules/tags/schema/tag.schema';
import { Todo } from 'src/modules/todo/schema/todo.schema';
import { FlashcardReview } from 'src/modules/flashcards/schema/flashcard-review.schema';

export enum Action {
  MANAGE = 'MANAGE',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Notification
      | typeof Tag
      | typeof Collection
      | typeof Note
      | typeof Summary
      | typeof Deck
      | typeof Flashcard
      | typeof FlashcardReview
      | typeof QuizTest
      | typeof QuizQuestion
      | typeof QuizAttempt
      | typeof Todo
      | typeof UserStatistic
    >
  | 'all';

type PossibleAbilities = [Action, Subjects];

type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: IUser) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions> as any,
    );

    if (user.role === 'ADMIN') {
      can(Action.MANAGE, [User, Notification, Tag]);

      can(
        [Action.READ, Action.DELETE],
        [
          Collection,
          Note,
          Summary,
          Deck,
          Flashcard,
          FlashcardReview,
          QuizTest,
          QuizQuestion,
          QuizAttempt,
          Todo,
          UserStatistic,
        ],
      );

      cannot(
        [Action.CREATE, Action.UPDATE],
        [
          Collection,
          Note,
          Summary,
          Deck,
          Flashcard,
          FlashcardReview,
          QuizTest,
          QuizQuestion,
          QuizAttempt,
          Todo,
          UserStatistic,
        ],
      );
    } else {
      can([Action.READ, Action.UPDATE], User, {
        _id: user._id,
      } as MongoQuery<User>);

      cannot([Action.CREATE, Action.DELETE], User);

      can(Action.CREATE, [
        Tag,
        Collection,
        Note,
        Summary,
        Deck,
        Flashcard,
        FlashcardReview,
        QuizTest,
        QuizQuestion,
        QuizAttempt,
        Todo,
      ]);

      cannot(Action.CREATE, Notification);

      can(
        [Action.READ, Action.UPDATE, Action.DELETE],
        [
          Notification,
          Tag,
          Collection,
          Note,
          Summary,
          Deck,
          Flashcard,
          FlashcardReview,
          QuizTest,
          QuizQuestion,
          QuizAttempt,
          Todo,
        ],
        {
          userId: user._id,
        },
      );

      can(Action.READ, UserStatistic, {
        userId: user._id,
      });

      can(
        Action.READ,
        [
          Collection,
          Note,
          // Summary,
          Deck,
          Flashcard,
          QuizTest,
          QuizQuestion,
        ],
        {
          sharedWithUsers: { $in: [user._id] },
        },
      );

      cannot(
        [Action.UPDATE, Action.DELETE],
        [
          Collection,
          Note,
          // Summary,
          Deck,
          Flashcard,
          QuizTest,
          QuizQuestion,
        ],
        {
          sharedWithUsers: { $in: [user._id] },
        },
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
