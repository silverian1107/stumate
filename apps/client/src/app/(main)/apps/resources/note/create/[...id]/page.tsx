import MyEditor from './my-editor';

export default async function CreateNote(
  {
    // params,
  }: {
    params?: Promise<{ id: string }>;
  },
) {
  return (
    <div className="flex w-full items-start h-screen  bg-primary-50/50">
      <div className="flex w-full h-full flex-1 gap-5 p-10">
        {/* <NoteEditor noteId={id} /> */}
        <MyEditor />
      </div>
    </div>
  );
}
