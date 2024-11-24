import NoteEditor from './NoteEditor';

export default async function CreateNote({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="flex w-full items-start h-screen">
      <div className="flex w-full h-full flex-1 gap-5 p-10">
        <NoteEditor noteId={id} />
      </div>
    </div>
  );
}
