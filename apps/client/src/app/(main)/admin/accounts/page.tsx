'use client';

import DeleteIcon from '@mui/icons-material/Delete';
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
import { Edit } from 'lucide-react';
import React, { useState } from 'react';

const AccountList = () => {
  // Dữ liệu mặc định
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

  // State
  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);

  // Pagination logic
  const rowsPerPage = 6;
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Xử lý xóa bài viết
  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative ">
      <Typography variant="h5" gutterBottom>
        Manage Account
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">SST</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">User name</TableCell>
              <TableCell align="center">Birth day</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Avatar</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.company}</TableCell>
                <TableCell align="center">{row.field}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">{row.postDate}</TableCell>
                <TableCell align="center">
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
                    <DeleteIcon />
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
    </div>
  );
};

export default AccountList;
