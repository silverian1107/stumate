import { ArrowRightCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  data: {
    data: {
      user: {
        username: string;
      };
    };
  };
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  data,
  isCollapsed,
  setIsCollapsed
}) => (
  <div className="group flex h-[64px] w-full items-center justify-between px-5 text-base transition-all duration-300 hover:bg-primary-800">
    <div className="flex items-center gap-2">
      <Avatar className="border-2 border-black">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>Jo</AvatarFallback>
      </Avatar>
      <span className="font-semibold transition-all duration-300 group-hover:text-white">
        {data.data.user.username}
      </span>
    </div>
    <button
      className="cursor-pointer"
      type="button"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <ArrowRightCircle className="size-5 transition-all duration-300 group-hover:text-white" />
    </button>
  </div>
);

export default UserProfile;
