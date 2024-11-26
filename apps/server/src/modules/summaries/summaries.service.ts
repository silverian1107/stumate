import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { Summary, SummaryDocument } from './schema/summary.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
import { Note, NoteDocument } from '../notes/schema/note.schema';

@Injectable()
export class SummariesService {
  constructor(
    @InjectModel(Summary.name)
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
  ) {}

  async create(
    noteId: string,
    createSummaryDto: CreateSummaryDto,
    @User() user: IUser,
  ) {
    const newSummary = await this.summaryModel.create({
      content: createSummaryDto.content,
      noteId: noteId,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newSummary;
  }

  async findByNoteId(noteId: string) {
    const note = await this.noteModel.findOne({ _id: noteId });
    if (!note) {
      throw new NotFoundException('Not found note');
    }
    return await this.summaryModel.findOne({ noteId });
  }

  async update(
    id: string,
    updateSummaryDto: UpdateSummaryDto,
    @User() user: IUser,
  ) {
    return await this.summaryModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateSummaryDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Summary ID');
    }
    const summary = await this.summaryModel.findOne({ _id: id });
    if (!summary) {
      throw new NotFoundException('Not found summary');
    }
    return this.summaryModel.delete({ _id: id }, user._id);
  }
}
