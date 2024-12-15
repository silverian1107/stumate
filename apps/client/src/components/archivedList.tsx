import { FileTextIcon, FolderOpenIcon } from 'lucide-react';

import {
  useGetArchivedResources,
  useRestoreCollection
} from '@/hooks/use-collection';
import { useRestoreNote } from '@/hooks/use-note';
import { cn } from '@/lib/utils';

const ArchivedList = () => {
  const { data, isLoading } = useGetArchivedResources();
  const restoreNotes = useRestoreNote();
  const restoreCollections = useRestoreCollection();

  const handleRestoreNote = (
    documentId: string,
    type: 'Note' | 'Collection'
  ) => {
    if (type === 'Note') {
      restoreNotes.mutate(documentId);
    } else {
      restoreCollections.mutate(documentId);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No archived resources found.
      </div>
    );
  }
  const { data: dataArray } = data;

  return (
    <div className="space-y-2 overflow-auto">
      {dataArray.map((item) => (
        <div
          key={item._id}
          className={cn(
            'flex items-center p-2 rounded-md transition-all hover:bg-primary-100',
            item.type === 'Note' && 'bg-muted-50',
            item.type === 'Collection' && 'bg-muted-100'
          )}
        >
          <div className="ml-3 shrink-0">
            {item.type === 'Note' ? (
              <FileTextIcon className="size-5 text-primary-700" />
            ) : (
              <FolderOpenIcon className="size-5 text-primary-700" />
            )}
          </div>

          <div className="ml-3 grow truncate">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="text-xs text-muted-foreground">
              Archived: {new Date(item.archivedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => handleRestoreNote(item._id, item.type)}
              className="text-primary-600 text-xs hover:underline"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="text-xs text-destructive hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchivedList;
