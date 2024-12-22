'use client';

// import { useAccount } from '@/hooks/use-auth';
// import { useGetInfoUserQuery } from '@/service/rootApi';
import { Avatar } from '@mui/material';
import { Pen } from 'lucide-react';
import React from 'react';

import InputField from './_components/InputField';

const Profile = () => {
  //   const data = useAccount();
  //   const id = data.data?.data.user._id;
  //   const response = useGetInfoUserQuery({ id } as { id: string });

  return (
    <div className="px-8 py-5 rounded-lg bg-white w-2/3 h-[75vh] flex flex-col gap-5 ">
      <div className="flex gap-5 items-center">
        <div className="relative w-fit">
          <Avatar
            src=""
            alt=""
            sx={{ width: 150, height: 150 }}
            className="border border-purple-200 drop-shadow-md"
          />
          <div className="rounded-full bg-primary-400 w-fit p-1 text-white absolute  top-2 right-4">
            <Pen className="size-4" />
          </div>
        </div>
        <div className="h-fit">
          <p className="font-bold text-xl"> Nguyen Van Tran Anh</p>
          <p className="text-slate-500">230503</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-5 ">
        <InputField label="Firt Name" id="firt_name" value="Anh" type="text" />
        <InputField
          label="Last Name"
          id="last_name"
          value="Nguyen Van tran"
          type="text"
        />
        <InputField
          label="User's Name"
          id="user_name"
          value="Anhpro"
          type="text"
        />
        <InputField
          label="Email"
          id="email"
          value="nguyenvantrananh2352003@gmail.com"
          type="text"
        />
        <InputField
          label="Phone Number"
          id="phone_number"
          value="0365657777"
          type="text"
        />
        <InputField
          label="Birthday"
          id="birthday"
          value="05/05/2003"
          type="date"
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="gender">Gender</label>
          <select
            name=""
            id=""
            className=" border shadow rounded-md px-2 py-1.5 bg-slate-100 text-primary-950"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div
          className="flex justify-end
        
         items-end "
        >
          <button
            type="button"
            className="border px-4 py-1 rounded-md bg-primary-500 text-white text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
