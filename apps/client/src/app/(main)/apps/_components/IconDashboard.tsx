import type { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
}

const IconDashboard = ({ icon: Icon }: IconWrapperProps) => {
  return (
    <div className=" rounded-full h-6 w-6 border  p-1  bg-gray-200  flex justify-center items-center">
      <Icon className="size-4 text-gray-600" />
    </div>
  );
};

export default IconDashboard;
