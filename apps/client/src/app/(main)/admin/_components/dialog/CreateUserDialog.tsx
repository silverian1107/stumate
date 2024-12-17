import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from '@mui/material';

const CreateUserDialog = ({
  open,
  handleClose,
  newUser,
  errors,
  handleChange,
  handleSubmit
}: {
  open: boolean;
  handleClose: () => void;
  newUser: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Username"
          name="userName"
          fullWidth
          variant="outlined"
          value={newUser.userName}
          onChange={handleChange}
          error={!!errors.userName}
          helperText={errors.userName}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          fullWidth
          variant="outlined"
          value={newUser.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          fullWidth
          variant="outlined"
          value={newUser.passWord}
          onChange={handleChange}
          error={!!errors.passWord}
          helperText={errors.passWord}
        />
        <TextField
          margin="dense"
          label="Confirm password"
          name="confirm_password"
          fullWidth
          variant="outlined"
          value={newUser.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <TextField
          margin="dense"
          label="Role"
          name="role"
          select
          fullWidth
          variant="outlined"
          value={newUser.role}
          onChange={handleChange}
          error={!!errors.role}
          helperText={errors.role}
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
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

export default CreateUserDialog;
