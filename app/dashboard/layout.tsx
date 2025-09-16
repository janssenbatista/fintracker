import { ReactNode } from 'react';
import BottomBar from './bottom-bar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BottomBar />
    </>
  );
}
