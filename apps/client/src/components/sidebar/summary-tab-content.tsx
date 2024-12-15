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
import { Textarea } from '../ui/textarea';

export function SummaryTabContent() {
  const { data, isLoading } = useSummaryByNoteId();
  const createSummary = useCreateSummary();
  const updateSummary = useUpdateSummary();

  const [summary, setSummary] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  useEffect(() => {
    if (data && typeof data.content === 'string') {
      setSummary(data.content);
    }
  }, [data]);

  const toggleSummaryEdit = () => {
    setIsEditingSummary(!isEditingSummary);
  };

  const handleCreateSummary = async () => {
    await createSummary.mutateAsync();
    toggleSummaryEdit();
  };

  const handleSaveSummary = async () => {
    await updateSummary.mutateAsync({
      content: summary,
      summaryId: data._id
    });
    toggleSummaryEdit();
  };

  const generateAISummary = () => {
    // Implement AI summary generation logic here
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
            <Button variant="outline" size="sm" onClick={handleCreateSummary}>
              <Edit className="size-4 mr-2" /> Create Summary
            </Button>
            <Button variant="outline" size="sm" onClick={generateAISummary}>
              <Sparkles className="size-4 mr-2" /> Generate by AI
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {isEditingSummary ? (
              <>
                <Textarea
                  className="min-h-[150px]"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter a summary..."
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveSummary}
                  >
                    <Edit className="size-4 mr-2" />
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                    onClick={toggleSummaryEdit}
                  >
                    <Edit className="size-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="size-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Preview Summary</DialogTitle>
          </DialogHeader>
          <div
            className="text-sm min-h-[480px] max-h-[720px] overflow-auto mt-4"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              wordWrap: 'break-word'
            }}
          >
            {summary}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
