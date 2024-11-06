import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
}

const IconWrapper = ({ icon: Icon }: IconWrapperProps) => {
  return (
    <div className="p-1 rounded-full bg-primary-100 inline-block border border-dashed border-primary-800">
      <Icon className="w-5 h-5 text-primary-600" />
    </div>
  );
};

export default IconWrapper;
