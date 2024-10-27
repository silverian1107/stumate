import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteDocument } from './models/note.models';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note')
    private readonly NoteModel: Model<NoteDocument>,
  ) {}
}
