import { FileText, FolderOpen } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCreateCollection, useDocuments } from '@/hooks/use-collection';
import { useCreateNote } from '@/hooks/use-note';
import type { Collection, DocumentListProps, Note } from '@/types/collection';

import SidebarItem from './SidebarItem';

const DocumentList = ({
  parentDocumentId,
  level = 0,
  type = 'Collection'
}: DocumentListProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch documents, differentiating between 'Collection' and 'Note'
  const {
    data: documents,
    isLoading: documentsLoading,
    error: documentsError
  } = useDocuments({ parentDocumentId, type, level });
  const createCollection = useCreateCollection();
  const createNote = useCreateNote();

  // Handle expand/collapse logic
  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const onCreateCollection = (document: Collection | Note) => {
    createCollection.mutate({
      name: 'New Collection',
      parentId: document._id
    });

    if (!expanded[document._id]) {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [document._id]: true
      }));
    }
  };

  const onCreateNote = async (document: Collection | Note) => {
    createNote.mutate(
      {
        name: 'New Note',
        parentId: document._id
      },
      {
        onSuccess: (data) => {
          router.push(`/apps/resources/notes/${data.data._id}`);
        }
      }
    );
    if (!expanded[document._id]) {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [document._id]: true
      }));
    }
  };

  const onClick = (document: Collection | Note) => {
    if (document.type === 'Note') {
      redirect(`/apps/resources/notes/${document._id}`);
    } else if (document.type === 'Collection') {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [document._id]: !prevExpanded[document._id]
      }));
    }
  };

  if (documentsLoading) {
    return (
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className="text-sm font-medium text-muted-foreground"
      >
        Loading...
      </p>
    );
  }

  if (!documents || documents.length === 0 || documentsError) {
    return (
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className="text-sm font-medium text-muted-foreground"
      >
        No documents inside.
      </p>
    );
  }

  return (
    <>
      {documents.map((document: Collection | Note) => (
        <div key={document._id}>
          <SidebarItem
            id={document._id}
            // @ts-expect-error Kiểm tra đang là Collection hay Note để lấy tên
            label={document.name || document.title}
            icon={document.type === 'Collection' ? FolderOpen : FileText}
            level={level}
            type={document.type}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
            onClick={() => onClick(document)}
            onCreateNote={() => onCreateNote(document)}
            onCreateCollection={() => onCreateCollection(document)}
          />
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
              type={document.type}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
