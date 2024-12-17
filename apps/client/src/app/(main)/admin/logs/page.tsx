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
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const LogPage = () => {
  const defaultData = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    category: 'user',
    event: 'User logs in',
    name: 'anhpro',
    date: '09/12/2024'
  }));

  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredData = data.filter((row) => {
    const matchesCategory = categoryFilter
      ? row.category === categoryFilter
      : true;
    const matchesDate = dateFilter ? row.date === dateFilter : true;
    return matchesCategory && matchesDate;
  });

  const rowsPerPage = 8;
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative">
      <Typography
        variant="h5"
        gutterBottom
        className="flex gap-40 items-center"
      >
        Manage Logs
        <div className="flex gap-10  text-sm mt-1 items-center ">
          {/* Category Filter */}
          <div className="flex gap-3 border px-1 rounded-lg border-primary-200">
            <p>Category:</p>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 items-center">
            <p>Date:</p>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
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
                Category
              </TableCell>
              <TableCell align="center" size="small">
                Event
              </TableCell>
              <TableCell align="center" size="small">
                Name
              </TableCell>
              <TableCell align="center" size="small">
                Date
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
                  {row.category}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.event}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.name}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.date}
                </TableCell>
                <TableCell align="center" size="small">
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
        count={Math.ceil(filteredData.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}
      />
    </div>
  );
};

export default LogPage;
