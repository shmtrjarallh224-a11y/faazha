export const metadata = {
  title: 'Faazha',
  description: 'Faazha web app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>
        {children}
      </body>
    </html>
  );
}
