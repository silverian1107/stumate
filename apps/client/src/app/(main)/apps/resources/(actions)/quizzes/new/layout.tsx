export default function ResourceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full flex flex-col px-4 py-8 space-y-6 xl:w-4/5 mx-auto lg:text-base">
      {children}
    </div>
  );
}
