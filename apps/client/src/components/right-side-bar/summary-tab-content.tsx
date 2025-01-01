import { Edit, Eye, Sparkles, SparklesIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import {
  useCreateSummary,
  useSummaryByNoteId,
  useUpdateSummary
} from '@/hooks/use-summary';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Spinner } from '../ui/spinner'; // Import the Spinner component
import { Textarea } from '../ui/textarea';

export function SummaryTabContent() {
  const { data, isLoading } = useSummaryByNoteId();
  const createSummary = useCreateSummary();
  const updateSummary = useUpdateSummary();

  const [summary, setSummary] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingInPreview, setIsEditingInPreview] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (data && typeof data.content === 'string') {
      setSummary(data.content);
    }
  }, [data]);

  const handleCreateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      await createSummary.mutateAsync();
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleOpenPreview = (editMode = false) => {
    setShowPreview(true);
    setIsEditingInPreview(editMode);
    setEditedSummary(summary);
  };

  const handleSaveSummary = async () => {
    await updateSummary.mutateAsync({
      content: editedSummary,
      summaryId: data._id
    });
    setSummary(editedSummary);
    setIsEditingInPreview(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <SparklesIcon className="size-4" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data === null || data === undefined ? (
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? (
                <>
                  <Spinner size="small" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" /> Generate
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div
              className="text-sm min-h-[150px] overflow-auto"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                wordWrap: 'break-word'
              }}
            >
              {summary}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPreview(true)}
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPreview(false)}
              >
                <Eye className="size-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingInPreview ? 'Edit Summary' : 'Preview Summary'}
            </DialogTitle>
          </DialogHeader>
          {isEditingInPreview ? (
            <Textarea
              className="min-h-[480px] max-h-[720px] mt-4"
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              placeholder="Enter a summary..."
            />
          ) : (
            <div
              className="text-sm min-h-[480px] max-h-[720px] overflow-auto mt-4"
              style={{
                wordWrap: 'break-word'
              }}
            >
              {summary}
            </div>
          )}
          <DialogFooter className="mt-6">
            {isEditingInPreview ? (
              <>
                <Button variant="outline" onClick={handleSaveSummary}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingInPreview(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingInPreview(true)}
                >
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
