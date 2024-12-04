import Logo from "@/components/ui/Logo";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex items-center  flex-col flex-grow h-full">
      <div className="w-full grid grid-rows-[100px_1fr]  h-full">
        <div className="text-3xl self-center text-center ">
          <Logo />
        </div>
        <div className="px-6">{children}</div>
      </div>
    </main>
  );
}
