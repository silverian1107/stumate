'use client';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { Cake, IdCard, Mail, PenLine, Shield } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { User } from '@/service/rootApi';
import { useGetInfoUserQuery, useUpdateUserMutation } from '@/service/rootApi';

const UserDetail = () => {
  const [user, setUser] = useState<User>();
  const { id: UserId } = useParams();

  const id = Array.isArray(UserId) ? UserId[0] : UserId || '';
  const { data, isSuccess } = useGetInfoUserQuery({ id });
  const [updateUser, { isSuccess: isSuccessUpdate }] = useUpdateUserMutation();
  useEffect(() => {
    if (isSuccess) {
      setUser(data.data);
    }
  }, [isSuccess, data]);
  console.log('user', user);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ ...user?.user });

  const handleEditClick = () => {
    setEditData({ ...user?.user });
    setEditDialogOpen(true);
  };
  console.log('editData', editData);
  const handleInputChange = (field: string, value: string) => {
    if (field === 'birthday') {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        alert('Birthday cannot be a future date!');
        return;
      }
    }

    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = async () => {
    try {
      const {
        _id: userId,
        username,
        name,
        birthday,
        gender,
        avatarUrl
      } = editData;
      await updateUser({
        _id: userId,
        username,
        name,
        birthday,
        gender,
        avatarUrl
      });
      if (isSuccessUpdate) {
        toast.success('User updated successfully!', { position: 'top-right' });
      }
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
    setEditDialogOpen(false);
  };

  return (
    <div className="rounded-lg py-3 bg-white w-full max-w-[600px] mx-auto h-fit shadow-lg">
      <div className="flex justify-between items-center px-6">
        <Typography variant="h5" gutterBottom>
          User Details
        </Typography>
        <PenLine
          className="size-4 text-primary-500 cursor-pointer"
          onClick={handleEditClick}
        />
      </div>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{ padding: '12px', borderRadius: '5px' }}
      >
        <Box className="w-full flex items-center gap-7">
          <Avatar
            src={user?.user.avatarUrl || ''}
            alt={user?.user.name || ''}
            sx={{ width: 100, height: 100 }}
          />
          <div>
            <Typography variant="h6" color="primary" className="text-center">
              {user?.user.name || 'N/A'}
            </Typography>
            <div className="flex text-slate-500">
              <Typography variant="body1" fontWeight="bold">
                @
              </Typography>
              <Typography variant="body1">
                {user?.user.username || 'N/A'}
              </Typography>
            </div>
          </div>
        </Box>
        <Box className="w-full">
          <Box className="flex px-4 gap-2 py-2">
            <Mail />
            <Typography variant="body1">{user?.user.email || 'N/A'}</Typography>
          </Box>

          <Box className="flex px-4 gap-2 py-2">
            <Shield />
            <Typography variant="body1">
              {user?.user.gender || 'N/A'}
            </Typography>
          </Box>
          <Box className="flex px-4 gap-2 py-2">
            <Cake />
            <Typography variant="body1">
              {user?.user?.birthday?.split('T')[0] || 'N/A'}
            </Typography>
          </Box>
          <Box className="flex px-4 gap-2 py-2">
            <IdCard />
            <Typography variant="body1">{user?.user.role || 'N/A'}</Typography>
          </Box>
        </Box>
        {user?.user.role === 'ADMIN' && (
          <>
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h6" className="pl-5">
              Statistics
            </Typography>

            <Box className="w-full px-4 grid grid-cols-4">
              <Box className="flex flex-col items-center border  py-2">
                <p className="font-bold text-4xl text-primary-500">
                  {user.userStatistics.totalNotesCount}
                </p>
                <p className="text-xs text-slate-500">Notes</p>
              </Box>

              <Box className="flex flex-col border items-center py-2">
                <p className="font-bold text-4xl text-primary-500">
                  {user.userStatistics.totalFlashcardsCount}
                </p>
                <p className="text-xs text-slate-500">Flashcards</p>
              </Box>

              <Box className="flex flex-col border items-center py-2">
                <p className="font-bold text-4xl text-primary-500">
                  {user.userStatistics.totalQuizzesCount}
                </p>
                <p className="text-xs text-slate-500">Quizzes</p>
              </Box>

              <Box className="flex flex-col border items-center py-2">
                <p className="font-bold text-4xl text-primary-500">
                  {user.userStatistics.sharedResourcesCount}
                </p>
                <p className="text-xs text-slate-500">Share</p>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <p className="text-center font-bold text-xl mt-3">Edit User Details</p>
        <DialogContent className="w-[40vw]">
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Avatar"
              value={editData.avatarUrl || ''}
              onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
              fullWidth
            />
            <TextField
              label="Name"
              value={editData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Username"
              value={editData.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value)}
              fullWidth
            />
            <TextField
              label="Birthday"
              type="date"
              value={
                editData.birthday
                  ? new Date(editData.birthday).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              InputProps={{
                inputProps: {
                  max: new Date().toISOString().split('T')[0] // Định dạng ngày tối đa là hôm nay
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
            />
            <TextField
              select
              label="Gender"
              value={editData.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              fullWidth
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;
