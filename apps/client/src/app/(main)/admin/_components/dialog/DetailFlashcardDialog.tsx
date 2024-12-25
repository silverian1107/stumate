import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

const DetailFlashcardDialog = ({
  isDialogOpen,
  handleCloseDialog,
  selectedFlashcard
}: {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  selectedFlashcard: any;
}) => {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Flashcard Details</DialogTitle>
      <DialogContent className="flex flex-col gap-2 w-full">
        {selectedFlashcard && (
          <>
            <DialogContentText>
              <strong className="mr-2">Create By:</strong>{' '}
              {selectedFlashcard.createdBy.username}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">DeckID: </strong>{' '}
              {selectedFlashcard.deckId}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Create Date:</strong>{' '}
              {selectedFlashcard.createdAt}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Update Date:</strong>{' '}
              {selectedFlashcard.updatedAt}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Shared:</strong>{' '}
              {selectedFlashcard.isCloned ? 'true' : 'false'}
            </DialogContentText>
            <DialogContentText className="w-[35vw] max-h-[20vh]  flex flex-col">
              <strong className="text-wrap">Front:</strong>
              <span className=" border px-2 py-1 overflow-auto min-h-10 flex flex-col">
                {selectedFlashcard.front}
              </span>
            </DialogContentText>
            <DialogContentText className="w-[35vw] max-h-[20vh]  flex flex-col">
              <strong className="text-wrap">Back:</strong>
              <span className=" border px-2 py-1 overflow-auto min-h-10 flex flex-col">
                {selectedFlashcard.back}
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

export default DetailFlashcardDialog;
