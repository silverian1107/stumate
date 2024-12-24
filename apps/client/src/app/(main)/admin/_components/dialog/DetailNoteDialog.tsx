import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

const DetailNoteDialog = ({
  isDialogOpen,
  handleCloseDialog,
  selectedNote
}: {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  selectedNote: any;
}) => {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Note Details</DialogTitle>
      <DialogContent className="flex flex-col gap-2 w-full">
        {selectedNote && (
          <>
            <DialogContentText>
              <strong className="mr-2">Note Name:</strong> {selectedNote.name}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Username:</strong> {selectedNote.ownerId}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Create Date:</strong>{' '}
              {selectedNote.createdAt}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Update Date:</strong>{' '}
              {selectedNote.updatedAt}
            </DialogContentText>
            <DialogContentText className=" max-w-[30rem] text-nowrap overflow-hidden text-ellipsis">
              <strong className="mr-2">Attachments:</strong>{' '}
              {selectedNote?.attachment?.join(',') || 'No attachments'}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Tags:</strong>
              {selectedNote?.tags?.join(',') || 'No tags'}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">IsPublished:</strong>{' '}
              {selectedNote.isPublished ? 'true' : 'false'}
            </DialogContentText>
            <DialogContentText className="w-[35vw] max-h-[20vh]  flex flex-col">
              <strong className="text-wrap">Content:</strong>
              <span className=" border px-2 py-1 overflow-auto min-h-10 flex flex-col">
                {(selectedNote?.body?.blocks || []).map((block: any) => (
                  <span key={block.id}>{block?.data?.text}</span>
                ))}
              </span>
            </DialogContentText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          color="primary"
          variant="contained"
          size="small"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailNoteDialog;
