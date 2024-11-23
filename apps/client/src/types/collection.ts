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
  parentDocumentId?: string;
  name: string;
};
