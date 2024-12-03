import MyEditor from '../_components/my-editor';
// import MyMenuBar from '../_components/my-menu-bar';
// import NoteEditor from '../_components/NoteEditor';

export default async function CreateNote() {
  return (
    <div className="flex flex-col w-full items-start h-screen bg-gray-50/50">
      {/* <MyMenuBar /> */}
      <div className="flex w-2/3 overflow-hidden gap-5 p-6">
        <MyEditor />
        {/* <NoteEditor /> */}
      </div>
    </div>
  );
}
