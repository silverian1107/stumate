import { PlusCircle } from 'lucide-react';

import SidebarItem from './SidebarItem';

interface CollectionsSectionProps {
  handleCreate: () => void;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  handleCreate
}) => (
  <SidebarItem
    label="New Collections"
    icon={PlusCircle}
    isButton={false}
    onClick={handleCreate}
  />
);

export default CollectionsSection;
