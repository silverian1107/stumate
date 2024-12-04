/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */

'use client';

import { Tag, useTagQuery } from '@/service/rootApi';
import { useEffect, useState } from 'react';
import UserTags from './UserTags';
import CombinedTags from './CombinedTags';

const TagList = () => {
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [combinedTags, setCombinedTags] = useState<Tag[]>([]);

  const { data, isSuccess } = useTagQuery();
  useEffect(() => {
    if (isSuccess) {
      console.log('response: ', data);
      setUserTags(data.data.userTags);
      setCombinedTags(data.data.combinedTags);
    }
  }, [isSuccess, data?.data]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border rounded-lg shadow-md">
      <UserTags userTags={userTags} />
      <div className="w-full h-px bg-gray-300" />
      <CombinedTags combinedTags={combinedTags} />
    </div>
  );
};

export default TagList;
