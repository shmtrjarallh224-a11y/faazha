import '../styles/globals.css';

export const metadata = {
  title: 'Faazha',
  description: 'Faazha web app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
