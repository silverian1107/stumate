interface NoteListProps {
  content: string;
  time: string;
  category: string;
  hour: string;
}

const Note: React.FC<NoteListProps> = ({
  content,
  time = ' 12/12/12',
  category = 'math',
  hour = '12:12'
}) => {
  return (
    <div className="w-full flex flex-col gap-1 px-4 py-2  ">
      <p className="overflow-hidden font-bold w-2/3">{content}</p>
      <div className="flex justify-between ">
        <p>
          {category}, {time}
        </p>
        <p>{hour}</p>
      </div>
    </div>
  );
};

export default Note;
