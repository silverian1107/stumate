export interface Collection {
  _id: string;
  name: string;
  type?: 'Collection' | 'Note';
  childrenDocs?: Collection[];
}

export interface Note {
  _id: string;
  title: string;
  type: 'Note';
  childrenDocs?: Note[];
}

export interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  type?: 'Collection' | 'Note';
}

export type CreateCollectionProps = {
  parentId?: string;
  name: string;
};

export type CreateNoteProps = {
  parentId: string;
  name: string;
};

export type UpdateCollectionParams = {
  _id: string;
  name: string;
};

export type UpdateCollectionBody = {
  name: string;
};
