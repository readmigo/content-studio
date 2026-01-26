import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Sidebar } from '@/components/layout/sidebar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Content Studio - Readmigo',
  description: 'Readmigo 书籍内容校正工具',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="app-gradient-bg">
        <NextIntlClientProvider messages={messages}>
          <div className="flex h-screen p-4 gap-4">
            <Sidebar />
            <main className="flex-1 overflow-auto glass-panel p-6">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
