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
import React, { useState } from 'react';

import CreateTagDialog from '../_components/dialog/CreateTagDialog';
import UpdateTagDialog from '../_components/dialog/UpdateTagDialog';

const TagList = () => {
  const defaultData = Array.from({ length: 71 }, (_, index) => ({
    id: index + 1,
    tagName: `Nguyen Van Tran Anh ${index + 1}`,
    username: 'anhpro',
    date: '09/12/2024',
    role: index % 2 === 0 ? 'admin' : 'user'
  }));

  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [tagUpdate, setTagUpdate] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [newTag, setNewTag] = useState({
    tagName: ''
  });
  const [errors, setErrors] = useState({
    tagName: ''
  });
  const [searchValue, setSearchValue] = useState('');

  const filteredData = data.filter(
    (row) =>
      (!filterRole || row.role === filterRole) &&
      (!searchValue ||
        row.role.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const rowsPerPage = 8;
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  const handleOpenCreate = () => setOpenCreate(true);
  const handleClose = () => {
    setOpenCreate(false);
    setNewTag({
      tagName: ''
    });
    setErrors({ tagName: '' });
  };

  const handleOpenUpdate = (row: any) => {
    setTagUpdate(row);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTag((prev) => ({ ...prev, [name!]: value }));
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value);
    setPage(1);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: { tagName: string } = {
      tagName: ''
    };

    if (!newTag.tagName.trim()) {
      newErrors.tagName = 'Tag name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleClose();
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative">
      <Typography variant="h5" gutterBottom className="flex justify-between">
        Manage Tag
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            placeholder="Search..."
            className="border-b text-sm px-2 py-1 border-primary-700"
          />
          <select
            className="text-sm  rounded-lg border-primary-500 text-primary-500"
            value={filterRole}
            onChange={handleRoleFilterChange}
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
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
                Tag name
              </TableCell>
              <TableCell align="center" size="small">
                User name
              </TableCell>
              <TableCell align="center" size="small">
                Date
              </TableCell>
              <TableCell align="center" size="small">
                Role
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
                  {(page - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.tagName}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.username}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.date}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.role}
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
          justifyContent: 'center',
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0
        }}
      />
      <CreateTagDialog
        open={openCreate}
        errors={errors}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        newTag={newTag}
      />
      <UpdateTagDialog
        open={openUpdate}
        errors={errors}
        handleChange={handleChange}
        handleClose={handleCloseUpdate}
        handleSubmit={handleSubmit}
        tag={tagUpdate}
      />
    </div>
  );
};

export default TagList;
