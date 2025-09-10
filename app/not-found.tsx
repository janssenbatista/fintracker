import Image from 'next/image';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

export default function NotFound() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-1">
      <Image
        src={'/404.png'}
        width={128}
        height={128}
        alt="imagem para página não encontrada"
      />
      <h1 className="text-2xl">Página não encontrada</h1>
      <Link href={'..'} className="link">
        <LuArrowLeft /> Voltar
      </Link>
    </main>
  );
}
