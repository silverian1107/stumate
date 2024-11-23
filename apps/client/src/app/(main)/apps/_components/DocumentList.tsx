import { useDocuments } from '@/hooks/use-collection';
import { FileText, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import SidebarItem from './SidebarItem';
import { Collection, DocumentListProps, Note } from '@/types/collection';

const DocumentList = ({
  parentDocumentId,
  level = 0,
  type = 'Collection',
}: DocumentListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch documents, differentiating between 'Collection' and 'Note'
  const {
    data: documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useDocuments({ parentDocumentId, type, level });

  // Handle expand/collapse logic
  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
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
            href={
              document.type === 'Note'
                ? `/apps/resources/note/create/${document._id}`
                : ''
            }
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
