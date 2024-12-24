import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from '@mui/material';

const UpdateNotiDialog = ({
  open,
  handleClose,
  noti,
  errors,
  handleChange,
  handleSubmit
}: {
  open: boolean;
  handleClose: () => void;
  noti: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Notification</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          name="title"
          value={noti.title || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          select
          label="Type"
          name="type"
          value={noti.type || ''}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="INFO">INFO</MenuItem>
          <MenuItem value="WARNING">WARNING</MenuItem>
          <MenuItem value="SUCCESS">SUCCESS</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Content"
          name="body"
          value={noti.body || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
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

export default UpdateNotiDialog;
