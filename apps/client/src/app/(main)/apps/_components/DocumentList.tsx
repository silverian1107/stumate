import { CollectionApi } from '@/endpoints/collection-api';
import { NoteApi } from '@/endpoints/note-api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FileText, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SidebarItem from './SidebarItem';

// Define types
interface Collection {
  _id: string;
  name: string;
  type: 'Collection' | 'Note';
  childrenDocs?: Collection[];
}

interface Note {
  _id: string;
  title: string;
  type: 'Note';
  childrenDocs?: Note[];
}

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  type?: 'Collection' | 'Note';
}

const DocumentList = ({
  parentDocumentId,
  level = 0,
  type = 'Collection',
}: DocumentListProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch documents, differentiating between 'Collection' and 'Note'
  const {
    data: documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useQuery<Collection[] | Note[], AxiosError>({
    queryKey: ['getDocuments', parentDocumentId, type],
    queryFn: async () => {
      if (!parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findByOwner({
          currentPage: 1,
          pageSize: 10,
          qs: '',
        });

        return response.data.data.result;
      } else if (parentDocumentId && type === 'Collection') {
        const response = await CollectionApi.findById(parentDocumentId);
        return response.data.data.childrenDocs || [];
      } else if (parentDocumentId && type === 'Note') {
        const response = await NoteApi.findById(parentDocumentId);
        return response.data.data.childrenDocs || [];
      }
      return [];
    },
    enabled: !!parentDocumentId || level === 0,
  });

  // Handle expand/collapse logic
  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // Handle navigation on click
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  // Loading state
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

  // Error or empty state
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
            onClick={() => onRedirect(document._id)}
            level={level}
            type={document.type}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
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
