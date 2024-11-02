import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { User } from 'src/decorator/customize';
import { Deck as DeckModel, DeckDocument } from './schema/deck.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import { User as UserModel, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(DeckModel.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async findDeckByName(name: string) {
    return await this.deckModel.findOne({ name });
  }

  async findParentDeckById(parentId: string) {
    return await this.deckModel.findOne({ _id: parentId });
  }

  isExistName = async (name: string) => {
    const deck = await this.findDeckByName(name);
    if (deck) return true;
    return false;
  };

  isExistUser = async (userId: string) => {
    const foundUser = await this.userModel
      .findOne({ _id: userId })
      .select('-password');
    if (foundUser) return true;
    return false;
  };

  async create(createDeckDto: CreateDeckDto, @User() user: IUser) {
    const { name, description, userId, parentId } = createDeckDto;
    //Check name already exists
    if (await this.isExistName(name)) {
      throw new BadRequestException(`Name '${name}' already exists`);
    }
    // Check user
    if (!(await this.isExistUser(userId))) {
      throw new BadRequestException(`User ID '${userId}' does not exist`);
    }
    //Create a new deck
    const newDeck = await this.deckModel.create({
      name,
      description,
      userId,
      parentId,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    //If the deck has a parent, it will be added
    const parentDeck = await this.findParentDeckById(parentId);
    if (parentDeck) {
      await this.deckModel.updateOne(
        { _id: parentId },
        {
          $push: {
            children: {
              _id: newDeck._id,
              name: newDeck.name,
            },
          },
        },
      );
    }
    return newDeck;
  }

  findAll() {
    return `This action returns all decks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deck`;
  }

  update(id: number, updateDeckDto: UpdateDeckDto) {
    return updateDeckDto;
  }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
