import NavBar from '@/components/_navbar/NavBar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="w-screen h-screen">
      <NavBar />
      {children}
    </main>
  );
}

/* Frame 1000003471 */
