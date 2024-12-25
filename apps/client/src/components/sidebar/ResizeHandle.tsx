import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  isResizing: boolean;
  handleMouseDown: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  isResizing,
  handleMouseDown
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    className={cn(
      'absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-primary-300',
      isResizing ? 'bg-primary-300' : 'bg-transparent'
    )}
    onMouseDown={handleMouseDown}
  />
);

export default ResizeHandle;
