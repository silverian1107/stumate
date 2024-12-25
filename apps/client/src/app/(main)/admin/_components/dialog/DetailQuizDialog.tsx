import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

const DetailQuizDialog = ({
  isDialogOpen,
  handleCloseDialog,
  selectedQuiz
}: {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  selectedQuiz: any;
}) => {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Quiz Details</DialogTitle>
      <DialogContent className="flex flex-col gap-2 w-full">
        {selectedQuiz && (
          <>
            <DialogContentText>
              <strong className="mr-2">Create By:</strong>{' '}
              {selectedQuiz.createdBy.username}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Number of question</strong>{' '}
              {selectedQuiz.numberOfQuestion}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Duration:</strong>{' '}
              {selectedQuiz.duration || 'N/A'}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Status:</strong> {selectedQuiz.status}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Shared:</strong>{' '}
              {selectedQuiz.isCloned ? 'true' : 'false'}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Create Date:</strong>{' '}
              {selectedQuiz.createdAt}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">Update Date:</strong>{' '}
              {selectedQuiz.updatedAt}
            </DialogContentText>
            <DialogContentText>
              <strong className="mr-2">
                {(selectedQuiz.tiltle && 'Title: ') ||
                  (selectedQuiz.name && 'Name: ')}
              </strong>{' '}
              {selectedQuiz.title || selectedQuiz.name}
            </DialogContentText>
            <DialogContentText className="w-[35vw] max-h-[20vh]  flex flex-col">
              <strong className="text-wrap">Descriptipn:</strong>
              <span className=" border px-2 py-1 overflow-auto min-h-10 flex flex-col">
                {selectedQuiz.description}
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

export default DetailQuizDialog;
