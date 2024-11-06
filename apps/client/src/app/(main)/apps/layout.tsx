import Sidebar from './_components/Sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-full relative flex text-sm">
      <Sidebar />
      <main className="flex-1 bg-primary-50">{children}</main>
    </div>
  );
}
