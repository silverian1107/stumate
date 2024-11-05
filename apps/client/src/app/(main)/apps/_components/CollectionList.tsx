import { useState } from 'react';
import { AxiosError } from 'axios';
import { FolderOpen, PlusCircle } from 'lucide-react';
import SidebarItem from './SidebarItem'; // Assuming this component exists
import { useQuery } from '@tanstack/react-query';
import { CollectionEndpoint } from '@/endpoints/collections-client';
import { useRouter } from 'next/navigation';

// Define types
interface Collection {
  _id: string;
  name: string;
  type: 'Collection' | 'Note';
  childrenDocs?: Collection[];
}

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
}

const CollectionList: React.FC<DocumentListProps> = ({
  parentDocumentId,
  level = 0,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // TODO: differential request between 'Note' and 'Collection'
  const {
    data: collections,
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useQuery<Collection[], AxiosError>({
    queryKey: ['getCollections', parentDocumentId],
    queryFn: async () => {
      if (!parentDocumentId) {
        const response = await CollectionEndpoint.findByOwner({
          currentPage: 1,
          pageSize: 10,
          qs: '',
        });
        return response.data.data.result;
      }

      const response = await CollectionEndpoint.findById(parentDocumentId);
      return response.data.data.childrenDocs || [];
    },
    enabled: !!parentDocumentId || level === 0,
  });

  const onExpand = (collectionId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [collectionId]: !prevExpanded[collectionId],
    }));
  };

  const onRedirect = (collectionId: string) => {
    router.push(`/documents/${collectionId}`);
  };

  if (collectionsLoading) {
    return (
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className="text-sm font-medium text-muted-foreground"
      >
        Loading...
      </p>
    );
  }

  if (!collections || collections.length === 0 || collectionsError) {
    return (
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className="text-sm font-medium text-muted-foreground"
      >
        No collections inside.
      </p>
    );
  }

  return (
    <>
      {collections.map((collection: Collection) => (
        <div key={collection._id}>
          <SidebarItem
            id={collection._id}
            label={collection.name}
            icon={collection.type === 'Collection' ? FolderOpen : PlusCircle}
            onClick={() => onRedirect(collection._id)}
            level={level}
            onExpand={() => onExpand(collection._id)}
            expanded={expanded[collection._id]}
          />
          {expanded[collection._id] && (
            <CollectionList
              parentDocumentId={collection._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default CollectionList;
