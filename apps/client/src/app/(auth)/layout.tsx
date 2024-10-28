export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <main className="bg-dark-200 flex items-center justify-center h-screen">
        <div className="bg-white text-black w-[450px] h-fit py-10 px-8">
          {children}
        </div>
      </main>
    )
  }