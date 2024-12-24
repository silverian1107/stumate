'use client';

import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Edit, Send, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { Notification } from '@/service/rootApi';
import {
  useCreateNotificationMutation,
  useDeleteNotiMutation,
  useGetALlNotificationsQuery,
  useUpdateNotiMutation
} from '@/service/rootApi';

import CreateNotiDialog from '../_components/dialog/CreateNotiDialog';
import UpdateNotiDialog from '../_components/dialog/UpdateNotiDialog';
import Panigation from '../_components/Panigation';

const NotificationList = () => {
  const [current, setCurrent] = useState(1);
  const [title, setTitle] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const { data, isSuccess } = useGetALlNotificationsQuery({
    current,
    title,
    createdAt
  });
  const [createNotification] = useCreateNotificationMutation();
  const [deleteNoti] = useDeleteNotiMutation();
  const [updateNoti] = useUpdateNotiMutation();

  const [count, setCount] = useState<number>(1);
  const [dataNotifications, setDataNotifications] = useState<
    Notification[] | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [notiUpdate, setNotiUpdate] = useState<Notification>({
    _id: '',
    title: '',
    body: '',
    type: '',
    createdAt: '',
    userId: '',
    role: '',
    isRead: false,
    deleted: false,
    updatedAt: '',
    __v: 0
  });

  useEffect(() => {
    if (isSuccess) {
      setDataNotifications(data.data.result);
      setCount(data.data.meta.pages);
    }
  }, [isSuccess, data, title, createdAt]);

  const [open, setOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    type: 'INFO',
    body: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });

  // Xử lý xóa bài viết
  // const handleDelete = (id: number) => {
  //   setData(data.filter((row) => row.id !== id));
  // };

  // Xử lý mở/đóng popup
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewNotification({
      title: '',
      type: 'INFO',
      body: ''
    });
    setErrors({ title: '', content: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewNotification((prev) => ({ ...prev, [name!]: value }));
  };

  // Hàm kiểm tra lỗi
  const validateForm = () => {
    let isValid = true;
    const newErrors: { title: string; content: string } = {
      title: '',
      content: ''
    };

    if (!newNotification.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!newNotification.body.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await createNotification(newNotification);
        toast.success('Notification sent successfully!', {
          position: 'top-right'
        });
        setNewNotification({
          title: '',
          type: 'Alert',
          body: ''
        });
        handleClose();
      } catch (error) {
        toast.error(`${error}`, {
          description: 'Please try again.',
          position: 'top-right'
        });
      }
    }
  };

  const handleDeleteOpen = (noti: Notification) => {
    setSelectedNotification(noti);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedNotification(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNoti(selectedNotification?._id);
      setDeleteDialogOpen(false);
      toast.success('Notification removed successfully!', {
        position: 'top-right'
      });
      setSelectedNotification(null);
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  const handleOpenUpdate = (row: any) => {
    setNotiUpdate(row);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleChangeUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotiUpdate((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmitUpdate = async () => {
    try {
      const { body, title: notiTitle, type, _id: id } = notiUpdate;
      await updateNoti({ id, body, title: notiTitle, type });
      handleCloseUpdate();
      toast.success('Notification updated successfully!', {
        position: 'top-right'
      });
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
      <Typography variant="h5" gutterBottom className="flex justify-between">
        Manage Notification
        <div className="flex gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setCurrent(1);
              setTitle(e.target.value);
            }}
            placeholder="Search..."
            className="border-b text-sm px-2 py-1 border-primary-700 "
          />
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 text-sm items-center">
            <p>Date:</p>
            <input
              type="date"
              value={createdAt}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setCreatedAt(date.toISOString());
              }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="!text-xs flex gap-1 items-center mr-2 border px-1 bg-primary-700 text-white rounded-lg hover:bg-primary-200 "
        >
          <Send className="size-3" /> Send
        </button>
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ marginTop: '20px', minHeight: '70vh' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" size="small">
                SST
              </TableCell>
              <TableCell align="center" size="small" width="20%">
                Title
              </TableCell>
              <TableCell align="center" size="small" width="40%">
                Content
              </TableCell>
              <TableCell align="center" size="small">
                Date Send
              </TableCell>
              <TableCell align="center" size="small">
                Type
              </TableCell>
              <TableCell align="center" size="small">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(dataNotifications || []).map((row, index) => (
              <TableRow key={row._id}>
                <TableCell align="center" size="small">
                  {10 * (current - 1) + index + 1}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis"
                >
                  {row.title}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis"
                >
                  {row.body}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.createdAt.split('T')[0]}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.type}
                </TableCell>
                <TableCell align="center" size="small">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpenUpdate(row)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteOpen(row)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Panigation
        count={count}
        page={current}
        setCurrent={(value: number) => setCurrent(value)}
      />
      <CreateNotiDialog
        handleChange={handleChange}
        errors={errors}
        handleClose={handleClose}
        handleSelectChange={handleSelectChange}
        handleSubmit={handleSubmit}
        newNotification={newNotification}
        open={open}
      />
      <UpdateNotiDialog
        open={openUpdate}
        errors={errors}
        handleChange={handleChangeUpdate}
        handleClose={handleCloseUpdate}
        handleSubmit={handleSubmitUpdate}
        noti={notiUpdate}
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
            Are you sure you want to delete the notification?
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

export default NotificationList;
