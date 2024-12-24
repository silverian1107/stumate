'use client';

import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Edit, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useCreateNotificationMutation } from '@/service/rootApi';

const NotificationList = () => {
  // Dữ liệu mặc định
  const defaultData = Array.from({ length: 71 }, (_, index) => ({
    id: index + 1,
    title: 'Nguyen Van Tran Anh',
    body: 'abcde',
    date: '09/12/2024',
    type: 'Alert'
  }));

  const [createNotification, { isSuccess }] = useCreateNotificationMutation();

  // State
  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false); // Trạng thái hiển thị popup
  const [newNotification, setNewNotification] = useState({
    title: '',
    type: 'INFO',
    body: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });
  const [searchValue, setSearchValue] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const rowsPerPage = 8;
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Xử lý xóa bài viết
  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  // Xử lý mở/đóng popup
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewNotification({
      title: '',
      type: 'INFO',
      body: ''
    });
    setErrors({ title: '', content: '' }); // Reset lỗi
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
        if (isSuccess) {
          toast.success('Notification sent successfully!', {
            position: 'top-right'
          });
          setNewNotification({
            title: '',
            type: 'Alert',
            body: ''
          });
          handleClose();
        }
      } catch (error) {
        toast.error(`${error}`, {
          description: 'Please try again.',
          position: 'top-right'
        });
      }
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative">
      <Typography variant="h5" gutterBottom className="flex justify-between">
        Manage Notification
        <div className="flex gap-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            placeholder="Search..."
            className="border-b text-sm px-2 py-1 border-primary-700 "
          />
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 text-sm items-center">
            <p>Date:</p>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="!text-xs flex gap-1 items-center mr-2 border px-1 bg-primary-700 text-white rounded-lg hover:bg-primary-200 "
        >
          <Plus className="size-3" /> Create
        </button>
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ marginTop: '20px', minHeight: '60vh' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" size="small">
                SST
              </TableCell>
              <TableCell align="center" size="small">
                Title
              </TableCell>
              <TableCell align="center" size="small">
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
            {paginatedData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center" size="small">
                  {index + 1}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.title}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.body}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.date}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.type}
                </TableCell>
                <TableCell align="center" size="small">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0
        }}
      />

      {/* Popup Form */}
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationList;
