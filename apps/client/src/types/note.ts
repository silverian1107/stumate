import { OutputData } from '@editorjs/editorjs';

export interface Note {
  _id: string;
  ownerId: string;
  parentId: string;
  children: {
    _id: string;
  }[];
  type: string;
  name: string;
  body: {
    time: number;
    blocks: unknown[];
  };
  level: number;
  position: number;
  isPublished: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  attachment: string[];
  tags: string;
}

export type NoteUpdateDto = {
  _id: string;
  name?: string;
  body?: OutputData;
  attachment?: string[];
};
