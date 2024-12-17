import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';

const UpdateTagDialog = ({
  open,
  handleClose,
  tag,
  errors,
  handleChange,
  handleSubmit
}: {
  open: boolean;
  handleClose: () => void;
  tag: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tagname"
          name="tagname"
          fullWidth
          variant="outlined"
          value={tag?.tagName}
          onChange={handleChange}
          error={!!errors.userName}
          helperText={errors.userName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTagDialog;
