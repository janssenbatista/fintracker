'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuArrowRightToLine } from 'react-icons/lu';
import { HiUserCircle } from 'react-icons/hi';

export default function Header() {
  const [user, setUser] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const headerRef = useRef<null | HTMLDivElement>(null);

  const supabase = createClient();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.replace('/login');
    supabase.auth.signOut();
  };

  useEffect(() => {
    getUserName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserName = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user.user_metadata.first_name);
    }
  };

  return (
    <header
      ref={headerRef}
      className="relative flex items-center justify-between p-2 md:p-4 gap-2"
    >
      <div className="flex gap-2 items-center">
        <Link href={'/'}>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Fin<span className="text-blue-500">Tracker</span>
          </h1>
        </Link>
      </div>
      <div className="relative" ref={menuRef}>
        <div className="flex gap-2 items-center">
          <p>
            {'Olá, '}
            <span className="text-lg font-medium">{user}</span>
          </p>

          <HiUserCircle
            className="w-[32px] h-[32px] md:w-[42px] md:h-[42px] text-blue-500 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
        {isOpen && (
          <div
            className={
              'absolute mt-2 right-1 bg-white border border-gray-200 rounded-sm'
            }
          >
            <ul className="flex flex-col gap-2">
              <li
                className="cursor-pointer flex gap-1 p-2 items-center hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LuArrowRightToLine size={18} className="text-red-500" />
                <span className="font-medium">Sair</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
