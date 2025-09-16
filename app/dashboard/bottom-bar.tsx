'use client';

import clsx from 'clsx';
import NavLink from 'next/link';
import { usePathname } from 'next/navigation';
import { LuHouse, LuList, LuSettings } from 'react-icons/lu';

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 right-0 left-0 p-2 bg-white border-t-[1px] border-gray-400 shadow-blue-400">
      <ul className="grid grid-cols-3">
        <li>
          <NavLink
            href={'.'}
            className={clsx('flex flex-col items-center gap-0 p-1 rounded-md', {
              'text-blue-500': pathname === '/dashboard',
            })}
          >
            <LuHouse size={18} />
            <span>Início</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            href={'/dashboard/transactions'}
            className={clsx('flex flex-col items-center gap-0 p-1 rounded-md', {
              'text-blue-500': pathname === '/dashboard/transactions',
            })}
          >
            <LuList size={18} />
            <span>Transações</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            href={'/dashboard/settings'}
            className={clsx('flex flex-col items-center gap-0 p-1 rounded-md', {
              'text-blue-500': pathname === '/dashboard/settings',
            })}
          >
            <LuSettings size={18} />
            <span>Configurações</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
