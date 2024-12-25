'use client';

import { Avatar, MenuItem, TextField } from '@mui/material';
import { Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAccount } from '@/hooks/use-auth';
import type { UserInfo } from '@/service/rootApi';
import {
  useEditAvatarMutation,
  useGetInfoUserQuery,
  useUpdateUserMutation
} from '@/service/rootApi';

const Profile = () => {
  const data = useAccount();
  const id = data.data?.data.user._id;
  const response = useGetInfoUserQuery({ id } as { id: string });
  const [updateUser] = useUpdateUserMutation();
  // const [editAvatarUrl] = useEditAvatarMutation();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (response.data) {
      setUser(response.data.data.user);
    }
  }, [response]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'birthday') {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        alert('Birthday cannot be a future date!');
        return;
      }
    }

    if (field === 'firstname' || field === 'lastname') {
      setUser((prev) => {
        if (!prev) return null;

        const nameParts = prev?.name?.split(' ') || [];
        if (field === 'firstname') {
          if (nameParts.length > 0) {
            nameParts[nameParts.length - 1] = value;
          }
        } else if (field === 'lastname') {
          nameParts.splice(0, nameParts.length - 1, ...value.split(' '));
        }

        return {
          ...prev,
          name: nameParts.join(' ')
        };
      });
      return;
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            [field]: value
          }
        : null
    );
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      const { _id: userId, username, name, birthday, gender, avatarUrl } = user;
      await updateUser({
        _id: userId,
        username,
        name,
        birthday,
        gender,
        avatarUrl
      });
      toast.success('User updated successfully!', { position: 'top-right' });
      setIsEdit(false);
    } catch (error) {
      toast.error(`${error}`, {
        description: 'Please try again.',
        position: 'top-right'
      });
    }
  };
  return (
    <div className="px-8 py-5 rounded-lg bg-white w-2/3 h-[75vh] flex flex-col gap-5 justify-center">
      <div className="flex gap-5 items-center mb-6">
        <div className="relative w-fit">
          <Avatar
            src={user?.avatarUrl}
            alt="avatar"
            sx={{ width: 150, height: 150 }}
            className="border border-purple-200 drop-shadow-md"
          />
          <div className="rounded-full bg-primary-400 w-fit p-1 text-white absolute  top-2 right-4">
            <Pen className="size-4" />
          </div>
        </div>
        <div className="h-fit">
          <p className="font-bold text-xl"> {user?.name}</p>
          <p className="text-slate-500">{user?.codeId}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-5 ">
        <TextField
          margin="dense"
          label="Firt Name"
          fullWidth
          variant="outlined"
          value={user?.name?.split(' ').slice(-1).join(' ') || ''}
          onChange={(e) => handleInputChange('firstname', e.target.value)}
          disabled={!isEdit}
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          variant="outlined"
          value={user?.name?.split(' ').slice(0, -1).join(' ') || ''}
          onChange={(e) => handleInputChange('lastname', e.target.value)}
          disabled={!isEdit}
        />
        <TextField
          label="Username"
          value={user?.username || ''}
          onChange={(e) => handleInputChange('username', e.target.value)}
          fullWidth
          disabled={!isEdit}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          variant="outlined"
          value={user?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={!isEdit}
        />

        <TextField
          label="Birthday"
          type="date"
          disabled={!isEdit}
          value={
            user?.birthday
              ? new Date(user.birthday).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => handleInputChange('birthday', e.target.value)}
          InputProps={{
            inputProps: {
              max: new Date().toISOString().split('T')[0]
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
          fullWidth
        />
        <TextField
          disabled={!isEdit}
          select
          label="Gender"
          value={user?.gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          fullWidth
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>
      </div>
      <div className="flex justify-center items-center ">
        {isEdit ? (
          <div>
            <button
              type="button"
              className="border px-4 py-1 rounded-md border-red-500 text-red-500 text-sm mr-8"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="border px-6 py-1 rounded-md bg-primary-500 text-white text-sm"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="border px-6 py-1 rounded-md bg-primary-500 text-white text-sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
export default Profile;
