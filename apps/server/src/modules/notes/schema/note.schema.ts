import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Note {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    enum: ['Collection', 'Note'],
  })
  parentId: string;

  @Prop({
    type: [
      {
        _id: { type: MongooseSchema.Types.ObjectId, required: true },
      },
    ],
    required: false,
    default: [],
  })
  children: {
    _id: string;
  }[];

  @Prop({ type: String, default: 'Note' })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      time: { type: Number, required: true },
      blocks: [{ type: MongooseSchema.Types.Mixed, required: false }],
    },
    required: false,
  })
  body: {
    time: number;
    blocks: any[];
  };

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: 0 })
  position: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: [] })
  attachment: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Populate children
NoteSchema.virtual('childrenDocs', {
  ref: 'Note',
  localField: 'children._id',
  foreignField: '_id',
});

NoteSchema.set('toObject', { virtuals: true });
NoteSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.id;
  },
});

NoteSchema.pre('save', async function (next) {
  if (this.isModified('isArchived') && this.isArchived) {
    await archiveChildren(this);
  }

  if (this.isModified('isArchived') && !this.isArchived) {
    await restoreChildren(this);
  }

  if (this.isModified('isDeleted') && this.isArchived && this.isDeleted) {
    await deleteChildren(this);
  }
  next();
});

async function archiveChildren(note: any) {
  const children = await note.model('Note').find({ parentId: note._id });
  for (const child of children) {
    child.isArchived = true;
    await child.save();
  }
}

async function restoreChildren(note: any) {
  const children = await note.model('Note').find({ parentId: note._id });
  for (const child of children) {
    child.isArchived = false;
    await child.save();
  }
}

async function deleteChildren(note: any) {
  const children = await note.model('note').find({ parentId: note._id });
  for (const child of children) {
    child.isDeleted = true;
    await child.save();
  }
}
