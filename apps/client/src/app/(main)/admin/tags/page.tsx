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
import { Edit, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { Tag } from '@/service/rootApi';
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useRenameTagMutation,
  useTagAdminQuery
} from '@/service/rootApi';

import CreateTagDialog from '../_components/dialog/CreateTagDialog';
import UpdateTagDialog from '../_components/dialog/UpdateTagDialog';

const TagList = () => {
  const { data, isSuccess: isSuccessGet } = useTagAdminQuery();
  const [renameTag] = useRenameTagMutation();
  const [createTag] = useCreateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [dataTags, setDataTags] = useState<Tag[] | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagUpdate, setTagUpdate] = useState<Tag>({
    _id: '',
    name: '',
    userId: '',
    deleted: false,
    __v: 0,
    createdBy: {
      _id: '',
      username: ''
    },
    createdAt: '',
    updatedAt: ''
  });
  const [newTag, setNewTag] = useState({
    name: ''
  });
  const [errors, setErrors] = useState({
    name: ''
  });
  const [searchValue, setSearchValue] = useState('');
  const [tagDelete, setTagDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccessGet) {
      setDataTags(data.data.allTags);
    }
  }, [data, isSuccessGet]);

  const filtereddataTags = (dataTags || []).filter((row) => {
    return row.name.toLowerCase().includes(searchValue);
  });

  const rowsPerPage = 10;
  const paginateddataTags = filtereddataTags.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // const handleDelete = (id: number) => {
  //   setDataTags(dataTags.filter((row) => row.id !== id));
  // };
  const validateForm = (name: string) => {
    let isValid = true;
    const newErrors: { name: string } = {
      name: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Tag name is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewTag({
      name: ''
    });
    setErrors({ name: '' });
  };
  const handleChangeCreate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTag((prev) => ({ ...prev, [name!]: value }));
  };
  const handleSubmitCreate = async () => {
    if (validateForm(newTag.name)) {
      try {
        const { name } = newTag;
        await createTag({ name });
        handleCloseCreate();
        toast.success('Tag created successfully!', {
          position: 'top-right'
        });
      } catch (error) {
        toast.error(`${error}`, {
          description: 'Please try again.',
          position: 'top-right'
        });
      }
    }
  };

  const handleOpenUpdate = (row: any) => {
    setTagUpdate(row);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleChangeUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTagUpdate((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmitUpdate = async () => {
    if (validateForm(tagUpdate.name)) {
      try {
        const { name, _id: id } = tagUpdate;
        await renameTag({ id, name });
        handleCloseUpdate();
        toast.success('Tag updated successfully!', {
          position: 'top-right'
        });
      } catch (error) {
        toast.error(`${error}`, {
          description: 'Please try again.',
          position: 'top-right'
        });
      }
    }
  };

  const handleDeleteOpen = (id: string) => {
    setTagDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setTagDelete(null);
    setDeleteDialogOpen(false);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteTag(tagDelete);
      setDeleteDialogOpen(false);
      toast.success('Tag removed successfully!', { position: 'top-right' });
      setTagDelete(null);
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white w-full h-[88vh] relative">
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
        sx={{ marginTop: '20px', minHeight: '70vh' }}
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
                Date Created
              </TableCell>
              <TableCell align="center" size="small">
                Date Updated
              </TableCell>
              <TableCell align="center" size="small">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginateddataTags.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell align="center" size="small">
                  {(page - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.name}
                </TableCell>
                <TableCell align="center" size="small">
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
                    onClick={() => handleOpenUpdate(row)}
                  >
                    <Edit />
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
      <Pagination
        count={Math.ceil(filtereddataTags.length / rowsPerPage)}
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
        handleChange={handleChangeCreate}
        handleClose={handleCloseCreate}
        handleSubmit={handleSubmitCreate}
        newTag={newTag}
      />
      <UpdateTagDialog
        open={openUpdate}
        errors={errors}
        handleChange={handleChangeUpdate}
        handleClose={handleCloseUpdate}
        handleSubmit={handleSubmitUpdate}
        tag={tagUpdate}
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
            Are you sure you want to delete this tag
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

export default TagList;
