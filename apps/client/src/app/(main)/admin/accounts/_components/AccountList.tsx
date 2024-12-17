'use client';

import {
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
import { Edit, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import CreateUserDialog from '../../_components/dialog/CreateUserDialog';

const AccountList = () => {
  const defaultData = Array.from({ length: 71 }, (_, index) => ({
    id: index + 1,
    title: 'Nguyen Van Tran Anh',
    company: 'AnhNoob',
    field:
      index % 3 === 0
        ? 'marketing'
        : index % 3 === 1
          ? 'finance'
          : 'engineering',
    quantity: Math.floor(Math.random() * 20) + 1,
    postDate: '09/12/2024',
    deadline: '10/12/2024',
    status: 'Đang mở'
  }));

  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    passWord: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    passWord: '',
    confirmPassword: '',
    role: 'USER'
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewUser({
      userName: '',
      email: '',
      passWord: '',
      confirmPassword: '',
      role: 'USER'
    });
    setErrors({
      userName: '',
      email: '',
      passWord: '',
      confirmPassword: '',
      role: 'USER'
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      userName: string;
      email: string;
      passWord: string;
      confirmPassword: string;
      role: string;
    } = {
      userName: '',
      email: '',
      passWord: '',
      confirmPassword: '',
      role: ''
    };

    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    if (!newUser.userName.trim()) {
      newErrors.userName = 'User name is required';
      isValid = false;
    }
    if (!newUser.passWord.trim()) {
      newErrors.passWord = 'Password is required';
      isValid = false;
    }
    if (!newUser.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const ROWS_PER_PAGE = 8;
  const paginatedData = data.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // Xử lý xóa bài viết
  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleClose();
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name!]: value }));
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative ">
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
        sx={{ marginTop: '20px', minHeight: '60vh' }}
      >
        <Table>
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
                Birthday
              </TableCell>
              <TableCell align="center" size="small">
                Gender
              </TableCell>
              <TableCell align="center" size="small">
                Avatar
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
                  {ROWS_PER_PAGE * (page - 1) + index + 1}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.title}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.company}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.field}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.quantity}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.postDate}
                </TableCell>
                <TableCell align="center" size="small">
                  <div className="flex items-center justify-around ">
                    <Link
                      href={`/admin/accounts/${row.id}`}
                      className="inline-block "
                    >
                      <Edit className="text-primary-500" />
                    </Link>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(row.id)}
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
        count={Math.ceil(data.length / ROWS_PER_PAGE)}
        page={page}
        onChange={(e, value) => setPage(value)}
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
    </div>
  );
};

export default AccountList;
