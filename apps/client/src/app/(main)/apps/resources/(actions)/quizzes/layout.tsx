export default function ResourceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex size-full flex-col space-y-6 px-4 py-8 lg:w-4/5 lg:text-base xl:w-3/5">
      {children}
    </div>
  );
}
