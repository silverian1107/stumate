'use client';

import { Avatar, Box, Divider, Typography } from '@mui/material';
import { Cake, IdCard, Mail, PenLine, Shield } from 'lucide-react';
import React from 'react';

const UserDetail = () => {
  // Dummy data for the user details
  const user = {
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
  };

  return (
    <div className=" rounded-lg  py-3 bg-white w-full max-w-[600px] mx-auto h-fit shadow-lg ">
      <div className="flex justify-between items-center px-6">
        <Typography variant="h5" gutterBottom>
          User Details
        </Typography>
        <PenLine className="size-4 text-primary-500" />
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
              {user.totalTags}
            </p>
            <p className="text-xs text-slate-500">Notes</p>
          </Box>

          <Box className="flex flex-col border items-center py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalTags}
            </p>
            <p className="text-xs text-slate-500">Flashcards</p>
          </Box>

          <Box className="flex flex-col border items-center py-2">
            <p className="font-bold text-4xl text-primary-500">
              {user.totalTags}
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
    </div>
  );
};

export default UserDetail;
