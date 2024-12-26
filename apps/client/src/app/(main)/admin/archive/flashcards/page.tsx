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
import { RotateCcw, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { IFlashcard } from '@/service/rootApi';
import {
  useDeleteFlashcardMutation,
  useGetAllArFlashcardsQuery,
  useRestoreFlashcardByIdMutation
} from '@/service/rootApi';

const FlashcardPage = () => {
  const [createdAt, setCreatedAt] = useState('');

  const { data, isSuccess } = useGetAllArFlashcardsQuery();
  const [restoreFlashcardById] = useRestoreFlashcardByIdMutation();
  const [deleteFlashcard] = useDeleteFlashcardMutation();

  const [count, setCount] = useState<number>(1);
  const [dataFlashcards, setDataFlashcards] = useState<
    IFlashcard[] | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(
    null
  );
  const [selectedFlashcardDele, setSelectedFlashcardDele] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isSuccess) {
      setDataFlashcards(data.data.result);
    }
  }, [isSuccess, data, createdAt]);

  const [open, setOpen] = useState(false);

  const handleOpen = (id: string) => {
    setOpen(true);
    setSelectedFlashcard(id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteOpen = (id: string) => {
    setSelectedFlashcardDele(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedFlashcardDele) {
        await deleteFlashcard({ id: selectedFlashcardDele });
        setDeleteDialogOpen(false);
        toast.success('Flashcard removed successfully!', {
          position: 'top-right'
        });
        setSelectedFlashcard(null);
      }
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  const handleRestoreConfirm = async () => {
    try {
      if (selectedFlashcard) {
        await restoreFlashcardById({ id: selectedFlashcard });
        setOpen(false);
        toast.success('Flashcard restored successfully!', {
          position: 'top-right'
        });
        setSelectedFlashcard(null);
      }
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  const filtereddataTags = (dataFlashcards || []).filter((row) => {
    return row.createdAt.includes(createdAt.split('T')[0].toLowerCase());
  });

  const rowsPerPage = 10;
  const paginatedDataFlashcards = filtereddataTags.slice(
    (count - 1) * rowsPerPage,
    count * rowsPerPage
  );

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
      <Typography variant="h5" gutterBottom className="flex gap-80">
        Archive Flashcards
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
              <TableCell align="center" size="small" width="20%">
                Front
              </TableCell>
              <TableCell align="center" size="small" width="20%">
                Back
              </TableCell>
              <TableCell align="center" size="small">
                Created By
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
            {(paginatedDataFlashcards || []).map((row, index) => (
              <TableRow key={row._id}>
                <TableCell align="center" size="small">
                  {10 * (count - 1) + index + 1}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-20 text-nowrap"
                >
                  {row.front}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-20 text-nowrap"
                >
                  {row.back}
                </TableCell>
                <TableCell
                  align="center"
                  size="small"
                  className="overflow-hidden text-ellipsis max-w-10 text-nowrap"
                >
                  {row.createdBy.username}
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
                    onClick={() => handleOpen(row._id)}
                    title="Restore"
                  >
                    <RotateCcw />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteOpen(row._id)}
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
      <Pagination
        count={Math.ceil(filtereddataTags.length / rowsPerPage)}
        page={count}
        onChange={(e, value) => setCount(value)}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}
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
            Are you sure you want to delete the Flashcard?
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Restore</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to restore the Flashcard?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRestoreConfirm} color="error">
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FlashcardPage;
