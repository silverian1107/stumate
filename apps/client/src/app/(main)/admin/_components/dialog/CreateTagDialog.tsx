import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';

const CreateTagDialog = ({
  open,
  handleClose,
  newTag,
  errors,
  handleChange,
  handleSubmit
}: {
  open: boolean;
  handleClose: () => void;
  newTag: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Tag</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name Tag"
          name="name"
          fullWidth
          variant="outlined"
          value={newTag.tagName}
          onChange={handleChange}
          error={!!errors.tagName}
          helperText={errors.tagName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTagDialog;
