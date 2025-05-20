import { ReactNode } from 'react';
import { MainLayout } from '@/layouts/MainLayout';

export default function ConfiguracionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
