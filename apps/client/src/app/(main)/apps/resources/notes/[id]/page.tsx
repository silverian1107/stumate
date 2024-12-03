import MyEditor from '../_components/my-editor';
import MyMenuBar from '../_components/my-menu-bar';

export default async function CreateNote() {
  return (
    <div className="flex flex-col w-full items-start h-screen bg-gray-50/50">
      <MyMenuBar />
      <div className="flex w-full overflow-hidden gap-5">
        <MyEditor />
      </div>
    </div>
  );
}
