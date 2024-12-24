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
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { INoteRoot } from '@/service/rootApi';
import {
  useArchiveNoteByIdMutation,
  useGetAllNotesQuery
} from '@/service/rootApi';

import DetailNoteDialog from '../_components/dialog/DetailNoteDialog';
import Panigation from '../_components/Panigation';

const NotePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createdAt, setCreatedAt] = useState('');

  const { data, isSuccess } = useGetAllNotesQuery({
    currentPage,
    createdAt
  });
  const [archiveNoteByIdMutation] = useArchiveNoteByIdMutation();

  const [count, setCount] = useState<number>(1);
  const [dataNotes, setDataNotes] = useState<INoteRoot[] | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INoteRoot | null>(null);
  const [selectedNoteDele, setSelectedNoteDele] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setDataNotes(data.data.result);
      setCount(data.data.meta.pages);
    }
  }, [isSuccess, data, createdAt]);

  const [open, setOpen] = useState(false);

  const handleOpen = (note: INoteRoot) => {
    setOpen(true);
    setSelectedNote(note);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteOpen = (id: string) => {
    setSelectedNoteDele(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedNoteDele) {
        await archiveNoteByIdMutation({ id: selectedNoteDele });
        setDeleteDialogOpen(false);
        toast.success('Note removed successfully!', {
          position: 'top-right'
        });
        setSelectedNote(null);
      }
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
      <Typography variant="h5" gutterBottom className="flex gap-80">
        Manage Notes
        <div className="flex gap-4">
          <div className="flex gap-3 px-1 rounded-lg border border-primary-200 text-sm items-center">
            <p>Created Date:</p>
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
              <TableCell align="center" size="small" width="30%">
                Note Name
              </TableCell>
              <TableCell align="center" size="small">
                Username
              </TableCell>
              <TableCell align="center" size="small">
                Created Date
              </TableCell>
              <TableCell align="center" size="small">
                Updated Date
              </TableCell>
              <TableCell align="center" size="small">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(dataNotes || [])
              .filter((row) => row.isArchived !== true)
              .map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell align="center" size="small">
                    {10 * (currentPage - 1) + index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    size="small"
                    className="overflow-hidden text-ellipsis max-w-10 text-nowrap"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    size="small"
                    className="overflow-hidden text-ellipsis max-w-10 text-nowrap"
                  >
                    <Link href={`/admin/accounts/${row.ownerId}`}>
                      {' '}
                      {row.ownerId}
                    </Link>
                  </TableCell>
                  <TableCell align="center" size="small">
                    {row.createdAt.split('T')[0]}
                  </TableCell>
                  <TableCell align="center" size="small">
                    {row.updatedAt.split('T')[0]}
                  </TableCell>
                  <TableCell align="center" size="small">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(row)}
                    >
                      <EllipsisVertical />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteOpen(row._id)}
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
      <DetailNoteDialog
        selectedNote={selectedNote}
        handleCloseDialog={handleClose}
        isDialogOpen={open}
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

export default NotePage;
