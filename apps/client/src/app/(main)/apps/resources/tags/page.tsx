/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable simple-import-sort/imports */



import TagList from './_components/TagList';

const page = () => {
  // const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="border w-2/3 rounded-lg h-[90vh] shadow-lg p-4 bg-white box-border m-auto mt-10 ">
      <TagList />
    </div>
  );
};

export default page;
