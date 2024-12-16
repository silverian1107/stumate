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
import { EllipsisVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import DetailNoteDialog from '../_components/dialog/DetailNoteDialog';

const NotePage = () => {
  const defaultData = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    noteName: 'hehe',
    userName: 'Anhpro',
    createDate: '12/09/2024',
    updateDate: '09/12/2024'
  }));

  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredData = data.filter((row) => {
    const matchesDate = dateFilter ? row.createDate === dateFilter : true;
    return matchesDate;
  });

  const rowsPerPage = 8;
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDelete = (id: number) => {
    setData(data.filter((row) => row.id !== id));
  };

  const handleDetail = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[80vh] relative">
      <Typography
        variant="h5"
        gutterBottom
        className="flex gap-40 items-center"
      >
        Manage Notes
        <div className="flex gap-10  text-sm mt-1 items-center ">
          {/* Category Filter */}
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 items-center">
            <p>Date create:</p>
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
                Note name
              </TableCell>
              <TableCell align="center" size="small">
                Username
              </TableCell>
              <TableCell align="center" size="small">
                Create date
              </TableCell>
              <TableCell align="center" size="small">
                Update date
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
                  {row.noteName}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.userName}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.createDate}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.updateDate}
                </TableCell>
                <TableCell align="center" size="small">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleDetail(row)}
                  >
                    <EllipsisVertical />
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
          justifyContent: 'center'
        }}
      />
      <DetailNoteDialog
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
        selectedNote={selectedNote}
      />
    </div>
  );
};

export default NotePage;
