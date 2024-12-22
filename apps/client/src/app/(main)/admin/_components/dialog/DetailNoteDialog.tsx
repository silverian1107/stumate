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
              <strong className="mr-2">Note Name:</strong>{' '}
              {selectedNote.noteName}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Username:</strong>{' '}
              {selectedNote.userName}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Create Date:</strong>{' '}
              {selectedNote.createDate}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Update Date:</strong>{' '}
              {selectedNote.updateDate}
            </DialogContentText>

            <DialogContentText>
              <strong className="mr-2">Attachments:</strong> hehe
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Tags:</strong>hehe
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">IsPublished:</strong> true
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">IsDeleted:</strong> true
            </DialogContentText>
            <DialogContentText className="w-[35vw] max-h-[20vh] flex flex-col">
              <strong className="text-wrap">Content:</strong>
              <span className="text-wrap border px-2 py-1 overflow-auto">
                nfkdsnf
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
