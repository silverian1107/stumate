import { useGetArchivedResources } from '@/hooks/use-collection';

const ArchivedList = () => {
  const { data, isLoading } = useGetArchivedResources();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return <div>ArchivedList</div>;
};

export default ArchivedList;
