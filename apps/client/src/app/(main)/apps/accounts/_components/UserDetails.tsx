'use client';

/* eslint-disable react/jsx-no-undef */

// eslint-disable-next-line unused-imports/no-unused-imports
import { Camera, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccount } from '@/hooks/use-auth';
import type { UserInfo } from '@/service/rootApi';
import { useGetInfoUserQuery, useUpdateUserMutation } from '@/service/rootApi';

export function UserDetails() {
  const data = useAccount();
  const userId = data.data?.data.user._id;

  const { data: userData, isFetching } = useGetInfoUserQuery({ id: userId } as {
    id: string;
  });
  const [updateUser] = useUpdateUserMutation();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (userData?.data?.user) {
      setUser(userData.data.user);
    }
  }, [userData]);

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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _id, username, name, birthday, gender, avatarUrl } = user;
      await updateUser({
        _id,
        username,
        name,
        birthday,
        gender,
        avatarUrl
      }).unwrap();

      toast.success('User updated successfully!');
      setIsEdit(false);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      toast.error('Failed to update user. Please try again.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      handleInputChange('avatarUrl', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  if (isFetching || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <Card className="mt-6 border rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <Button
                onClick={() => setIsEdit(!isEdit)}
                className="bg-[#6C5DD3] hover:bg-[#5C4DC3] text-white"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="size-48">
                  <AvatarImage
                    src={user.avatarUrl || ''}
                    alt={user.name || 'Avatar'}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                {isEdit && (
                  <label
                    htmlFor="avatar"
                    className="absolute left-2 top-2 cursor-pointer rounded-full bg-white p-2 shadow-sm"
                  >
                    <Camera className="size-4" />
                    <input
                      type="file"
                      id="avatar"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={user.name || ''}
                  onChange={(e) =>
                    handleInputChange('lastname', e.target.value)
                  }
                  disabled={!isEdit}
                  className={
                    !isEdit ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={user.username || ''}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  disabled={!isEdit}
                  className={
                    !isEdit ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled
                  className={
                    !isEdit ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <select
                  value={user.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEdit}
                  className={`w-full p-2 border rounded-md ${
                    !isEdit ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                  }`}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={
                    user.birthday
                      ? new Date(user.birthday).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleInputChange('birthday', e.target.value)
                  }
                  disabled={!isEdit}
                  className={!isEdit ? 'bg-gray-100' : ''}
                />
              </div>
            </div>
            {isEdit && (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEdit(false)}
                  className="border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#6C5DD3] hover:bg-[#5C4DC3] text-white"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
