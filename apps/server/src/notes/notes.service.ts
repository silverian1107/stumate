import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionsService } from 'src/collections/collections.service';
import { validateObjectId } from 'src/utils/validateId';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDocument } from './models/note.models';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note')
    private readonly noteModel: Model<NoteDocument>,
    private readonly collectionService: CollectionsService,
  ) {}

  async create(newNoteData: CreateNoteDto) {
    validateObjectId([newNoteData.ownerId, newNoteData.parentId]);

    try {
      const newNote = new this.noteModel(newNoteData);

      const { parentId } = newNoteData;

      const [parentNote, parentCollection] = await Promise.all([
        this.noteModel.findById(parentId),
        this.collectionService.findById(parentId).catch(() => {
          return null;
        }),
      ]);

      const parent = parentNote || parentCollection;

      if (!parent) {
        throw new NotFoundException(
          `Couldn't find the parent with ID: ${parentId}`,
        );
      }

      // Set the parentId properly as an object
      newNote.parentId = {
        _id: parent._id as string,
        type: parentNote ? 'Note' : 'Collection',
      };

      parent.children.push({
        _id: newNote._id as string,
        type: 'Note',
      });

      newNote.position = parent.children.length;
      newNote.level = parent.level + 1;

      await parent.save();
      return await newNote.save();
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }
}
