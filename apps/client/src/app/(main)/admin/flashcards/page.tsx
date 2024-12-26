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
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { IFlashcard } from '@/service/rootApi';
import {
  useArchiveFlashcardByIdMutation,
  useGetAllFlashcardQuery
} from '@/service/rootApi';

import DetailFlashcardDialog from '../_components/dialog/DetailFlashcardDialog';
import Panigation from '../_components/Panigation';

const FlashcardPage = () => {
  const [current, setCurrent] = useState(1);
  const [createdAt, setCreatedAt] = useState('');

  const { data, isSuccess } = useGetAllFlashcardQuery({
    current,
    createdAt
  });
  console.log('data', data);
  const [archiveFlashcardById] = useArchiveFlashcardByIdMutation();

  const [count, setCount] = useState<number>(1);
  const [dataFlashcards, setDataFlashcards] = useState<
    IFlashcard[] | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<IFlashcard | null>(
    null
  );
  const [selectedFlashcardDele, setSelectedFlashcardDele] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isSuccess) {
      setDataFlashcards(data.data.result);
      setCount(data.data.meta.pages);
    }
  }, [isSuccess, data, createdAt]);

  const [open, setOpen] = useState(false);

  const handleOpen = (flashcard: IFlashcard) => {
    setOpen(true);
    setSelectedFlashcard(flashcard);
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
        await archiveFlashcardById({ id: selectedFlashcardDele });
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

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
      <Typography variant="h5" gutterBottom className="flex gap-80">
        Manage Flashcards
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
            {(dataFlashcards || []).map((row, index) => (
              <TableRow key={row._id}>
                <TableCell align="center" size="small">
                  {10 * (current - 1) + index + 1}
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
        page={current}
        setCurrent={(value: number) => setCurrent(value)}
      />
      <DetailFlashcardDialog
        selectedFlashcard={selectedFlashcard}
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
            Are you sure you want to delete the flashcard?
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
export default FlashcardPage;
