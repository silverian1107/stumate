import type { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
}

const IconWrapper = ({ icon: Icon }: IconWrapperProps) => {
  return (
    <div className="inline-block rounded-full border border-dashed border-primary-800 bg-primary-100 p-1">
      <Icon className="size-5 text-primary-600" />
    </div>
  );
};

export default IconWrapper;
