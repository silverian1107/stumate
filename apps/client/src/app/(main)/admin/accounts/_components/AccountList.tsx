'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { EllipsisVertical, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { UserInfo } from '@/service/rootApi';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery
} from '@/service/rootApi';

import CreateUserDialog from '../../_components/dialog/CreateUserDialog';

const useStyles = {
  tableContainer: {
    marginTop: '20px',
    maxHeight: '70vh',
    overflowX: 'auto' as const
  },
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  actionCell: {
    minWidth: '100px',
    textAlign: 'center' as const
  }
};

const AccountList = () => {
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState<number | null>(null);
  const { data, isSuccess } = useGetAllUserQuery({ current });
  const [deleteUser] = useDeleteUserMutation();
  const [createUse] = useCreateUserMutation();

  const [allUsers, setAllUsers] = useState<UserInfo[] | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    if (isSuccess) {
      setAllUsers(data.data.result);
      setCount(data.data.meta.pages);
    }
  }, [isSuccess, data]);

  const [open, setOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'USER'
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'USER'
    });
    setErrors({
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'USER'
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      username: string;
      email: string;
      password: string;
      confirm_password: string;
      role: string;
    } = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      role: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(newUser.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!newUser.username.trim()) {
      newErrors.username = 'User name is required';
      isValid = false;
    }
    if (!newUser.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(newUser.password)) {
      newErrors.password =
        'Password must be 8+ chars, include upper, lower & special chars.';
      isValid = false;
    }
    if (!newUser.confirm_password.trim()) {
      newErrors.confirm_password = 'Confirm Password is required';
      isValid = false;
    } else if (newUser.confirm_password !== newUser.password) {
      newErrors.confirm_password = 'Confirm Password does not match Password';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const { username, email, password, role } = newUser;
        await createUse({ username, email, password, role });
        handleClose();
        toast.success('User created successfully!', {
          position: 'top-right'
        });
      } catch (error) {
        toast.error(`${error}`, {
          description: 'Please try again.',
          position: 'top-right'
        });
      }
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name!]: value }));
  };

  const handleDeleteOpen = (user: UserInfo) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedUser(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser?._id);
      setDeleteDialogOpen(false);
      toast.success('User removed successfully!', { position: 'top-right' });
      setSelectedUser(null);
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative ">
      <Typography variant="h5" gutterBottom className="flex justify-between">
        Manage Account
        <button
          type="button"
          onClick={handleOpen}
          className="!text-xs flex gap-1 items-center mr-2 border px-1 bg-primary-700 text-white rounded-lg hover:bg-primary-200"
        >
          <Plus className="size-3" /> Create
        </button>
      </Typography>
      <TableContainer
        component={Paper}
        style={useStyles.tableContainer}
        sx={{ marginTop: '20px', minHeight: '70vh' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" size="small">
                SST
              </TableCell>
              <TableCell align="center" size="small">
                Name
              </TableCell>
              <TableCell align="center" size="small">
                Username
              </TableCell>
              <TableCell align="center" size="small">
                Email
              </TableCell>
              <TableCell align="center" size="small">
                Birthday
              </TableCell>
              <TableCell align="center" size="small">
                Gender
              </TableCell>
              <TableCell
                align="center"
                size="small"
                style={useStyles.actionCell}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(allUsers || []).map((row, index) => (
              <TableRow key={row._id}>
                <TableCell align="center" size="small">
                  {10 * (current - 1) + index + 1}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  style={useStyles.tableCell}
                  className="max-w-40 overflow-hidden text-ellipsis"
                >
                  {row.name || 'N/A'}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  style={useStyles.tableCell}
                >
                  {row.username}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  style={useStyles.tableCell}
                  className="max-w-40 overflow-hidden text-ellipsis"
                >
                  {row.email}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.birthday?.split('T')[0] || 'N/A'}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.gender || 'N/A'}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  style={useStyles.actionCell}
                >
                  <div className="flex items-center justify-around">
                    <Link href={`/admin/accounts/${row._id}`} title="Detail">
                      <EllipsisVertical className="text-primary-500" />
                    </Link>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteOpen(row)}
                      title="Delete"
                    >
                      <Trash2 />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={count || 1}
        page={current}
        onChange={(e, value) => {
          setCurrent(value);
        }}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}
      />
      <CreateUserDialog
        open={open}
        errors={errors}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        newUser={newUser}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the account for{' '}
            <strong>{selectedUser?.username || 'this user'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountList;
