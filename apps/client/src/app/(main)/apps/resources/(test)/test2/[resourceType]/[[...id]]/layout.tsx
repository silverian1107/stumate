export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col px-4 py-8">{children}</div>
  );
}
