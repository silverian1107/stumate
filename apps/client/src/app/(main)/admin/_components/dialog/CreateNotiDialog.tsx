import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import React from 'react';

const CreateNotiDialog = ({
  open,
  handleClose,
  newNotification,
  errors,
  handleChange,
  handleSubmit,
  handleSelectChange
}: {
  open: boolean;
  handleClose: () => void;
  newNotification: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
  handleSelectChange: (event: SelectChangeEvent<string>) => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Notification</DialogTitle>
      <DialogContent className="max-w-full">
        <TextField
          margin="dense"
          label="Title"
          name="title"
          fullWidth
          variant="outlined"
          value={newNotification.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
        />
        <Select
          margin="dense"
          name="type"
          fullWidth
          value={newNotification.type}
          onChange={handleSelectChange}
        >
          <MenuItem value="INFO">INFO</MenuItem>
          <MenuItem value="WARNING">WARNING</MenuItem>
          <MenuItem value="SUCCESS">SUCCESS</MenuItem>
        </Select>
        <TextField
          margin="dense"
          label="Content"
          name="body"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={newNotification.body}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNotiDialog;
