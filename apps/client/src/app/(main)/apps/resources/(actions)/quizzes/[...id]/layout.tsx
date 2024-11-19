export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col px-4 py-8 space-y-6 lg:w-4/5 xl:w-3/5 mx-auto lg:text-base">
      {children}
    </div>
  );
}
