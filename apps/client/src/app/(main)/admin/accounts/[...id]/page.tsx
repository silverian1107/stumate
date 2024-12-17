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
import React, { useState } from 'react';

const UserDetail = () => {
  const [user, setUser] = useState({
    avatar: 'https://via.placeholder.com/150',
    name: 'Nguyen Van Tran Anh',
    username: 'anhpro',
    email: 'anhpro@example.com',
    gender: 'Male',
    birthDay: '23/05/2003',
    role: 'User',
    totalNotes: 45,
    totalFlashcards: 30,
    totalTags: 15,
    totalQuizzes: 12
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  const handleEditClick = () => {
    setEditData({ ...user });
    setEditDialogOpen(true);
  };

  const handleInputChange = (field: any, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Save changes
  const handleSave = () => {
    setUser(editData); // Save changes to user
    setEditDialogOpen(false);
  };

  return (
    <div className=" rounded-lg py-3 bg-white w-full max-w-[600px] mx-auto h-fit shadow-lg ">
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
        sx={{
          padding: '12px',
          borderRadius: '5px'
        }}
      >
        <Box className="w-full flex items-center gap-7 ">
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 100, height: 100 }}
          />
          <div>
            <Typography variant="h6" color="primary" className="text-center">
              {user.name}
            </Typography>
            <div className="flex text-slate-500 ">
              <Typography variant="body1" fontWeight="bold">
                @
              </Typography>
              <Typography variant="body1">{user.username}</Typography>
            </div>
          </div>
        </Box>
        <Box className="w-full">
          <Box className="flex px-4 gap-2 py-2 ">
            <Mail />
            <Typography variant="body1">{user.email}</Typography>
          </Box>

          <Box className="flex px-4 gap-2 py-2">
            <Shield />
            <Typography variant="body1">{user.gender}</Typography>
          </Box>
          <Box className="flex px-4 gap-2 py-2">
            <Cake />
            <Typography variant="body1">{user.birthDay}</Typography>
          </Box>
          <Box className="flex px-4 gap-2 py-2">
            <IdCard />
            <Typography variant="body1">{user.role}</Typography>
          </Box>
        </Box>

        <Divider sx={{ width: '100%' }} />
        <Typography variant="h6">Statistics</Typography>

        <Box className="w-full px-4 grid grid-cols-4">
          <Box className="flex flex-col items-center border  py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalNotes}
            </p>
            <p className="text-xs text-slate-500">Notes</p>
          </Box>

          <Box className="flex flex-col border items-center py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalFlashcards}
            </p>
            <p className="text-xs text-slate-500">Flashcards</p>
          </Box>

          <Box className="flex flex-col border items-center py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalQuizzes}
            </p>
            <p className="text-xs text-slate-500">Quizzes</p>
          </Box>

          <Box className="flex flex-col border items-center py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalTags}
            </p>
            <p className="text-xs text-slate-500">Tags</p>
          </Box>
        </Box>
      </Box>

      {/* Dialog for editing user details */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        {/* <DialogTitle >Edit User Details</DialogTitle> */}
        <p className="text-center font-bold text-xl mt-3">Edit User Details</p>
        <DialogContent className=" w-[40vw]">
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Avatar"
              value={editData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              fullWidth
            />
            <TextField
              label="Name"
              value={editData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
            />
            <TextField
              label="Username"
              value={editData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              fullWidth
            />
            <TextField
              label="Birthday"
              value={editData.birthDay}
              onChange={(e) => handleInputChange('birthDay', e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Gender"
              value={editData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              fullWidth
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
