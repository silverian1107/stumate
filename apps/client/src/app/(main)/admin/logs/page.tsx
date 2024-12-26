'use client';

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
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { FilterParams, LogEntry } from '@/service/rootApi';
import { useDeleteLogMutation, useGetLogsQuery } from '@/service/rootApi';

import Panigation from '../_components/Panigation';

const LogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});

  const { data, isSuccess } = useGetLogsQuery({
    currentPage,
    filters
  });
  const [deleteLog] = useDeleteLogMutation();

  const [count, setCount] = useState<number>(1);
  const [dataLogs, setDataLogs] = useState<LogEntry[] | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  };

  const parseDate = (dateString: string) => {
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    if (!inputDate) {
      setFilters((prev) => ({
        ...prev,
        datetime: undefined
      }));
      return;
    }
    const formattedDate = formatDate(inputDate);
    setFilters((prev) => ({
      ...prev,
      datetime: formattedDate
    }));
  };
  // Handle method filter
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;
    setFilters((prev) => ({
      ...prev,
      method: method || undefined
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      setDataLogs(data.data.result);
      setCount(data.data.meta.pages);
    }
  }, [isSuccess, data, filters]);

  const handleDeleteOpen = (id: string) => {
    setSelectedLog(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedLog(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLog(selectedLog);
      setDeleteDialogOpen(false);
      toast.success('Log removed successfully!', {
        position: 'top-right'
      });
      setSelectedLog(null);
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
      <Typography variant="h5" gutterBottom className="flex gap-20">
        Manage Logs
        <div className="flex gap-20">
          <div className="flex gap-1 !text-sm items-center">
            <label htmlFor="method"> Method:</label>
            <select
              onChange={handleMethodChange}
              className="border rounded-md text-sm px-2 py-1 border-primary-200"
            >
              <option value="">All</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 text-sm items-center">
            <p>Date:</p>
            <input
              type="date"
              value={filters.datetime ? parseDate(filters.datetime) : ''}
              onChange={handleDateChange}
            />
          </div>
        </div>
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
              <TableCell align="center" size="small">
                Date & Time
              </TableCell>
              <TableCell align="center" size="small">
                Username
              </TableCell>
              <TableCell align="center" size="small">
                Level
              </TableCell>
              <TableCell align="center" size="small">
                HTTP Method
              </TableCell>
              <TableCell align="center" size="small">
                Request URL
              </TableCell>
              <TableCell align="center" size="small">
                Status Code
              </TableCell>
              <TableCell align="center" size="small">
                API Address
              </TableCell>
              <TableCell align="center" size="small">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(dataLogs || []).map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center" size="small">
                  {10 * (currentPage - 1) + index + 1}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-10 text-nowrap"
                >
                  {row.datetime.split(',')[0]}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-[20%] text-nowrap"
                >
                  {row?.user?.username || 'N/A'}
                </TableCell>
                <TableCell align="center" size="small">
                  <p
                    className={
                      row.level === 'ERROR'
                        ? 'text-red-600'
                        : row.level === 'WARN'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }
                  >
                    {row.level}
                  </p>
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-10 text-nowrap text-bold"
                >
                  {row.method}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-10 text-nowrap text-bold"
                >
                  {row.originalUrl}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.statusCode}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.ip}
                </TableCell>
                <TableCell align="center" size="small">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteOpen(row.id)}
                    title="Delete"
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
        page={currentPage}
        setCurrent={(value: number) => setCurrentPage(value)}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-method"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-method">Confirm Delete</DialogTitle>
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

export default LogPage;
