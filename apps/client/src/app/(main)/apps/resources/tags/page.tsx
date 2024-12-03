/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable simple-import-sort/imports */

'use client';

import TagList from './_components/TagList';

const page = () => {
  // const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="border w-2/3 rounded-lg h-full shadow-lg p-4 bg-white box-border ">
      <TagList />
    </div>
  );
};

export default page;
