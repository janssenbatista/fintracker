import Image from 'next/image';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <Image
        src={'/logo.png'}
        width={128}
        height={128}
        alt="logo da aplicação"
        priority={false}
      />
      <h1 className="text-4xl font-bold mt-2">
        Fin<span className="text-blue-500">Tracker</span>
      </h1>
      {children}
    </main>
  );
}
